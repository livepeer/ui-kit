import * as tus from 'tus-js-client';

import { defaultStudioApiKey, studio } from '../../constants';
import { HttpError } from '../../errors';

import {
  CreateAssetArgs,
  GetAssetArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  UpdateAssetArgs,
} from '../../types';

import {
  BaseLivepeerProvider,
  FetchOptions,
  LivepeerProviderFn,
} from '../base';
import {
  GetTaskArgs,
  StudioAsset,
  StudioCreateAssetArgs,
  StudioCreateStreamArgs,
  StudioDeleteAssetArgs,
  StudioDeleteStreamArgs,
  StudioListArgs,
  StudioListPage,
  StudioStream,
  StudioStreamSession,
  StudioTask,
  StudioUpdateAssetArgs,
  StudioUpdateStreamArgs,
  WaitTaskArgs,
} from './types';

export type StudioLivepeerProviderConfig = {
  apiKey?: string | null;
};

/** The API does not currently return these fields, so we have to generate them
 * through the _mapToStream function. */
type RawStudioStream = Omit<StudioStream, 'rtmpIngestUrl' | 'playbackUrl'>;

export class StudioLivepeerProvider extends BaseLivepeerProvider {
  readonly _apiKey: string;
  readonly _defaultHeaders: { Authorization: `Bearer ${string}` };

  constructor(apiKey: string) {
    super(studio);

    this._apiKey = apiKey;
    this._defaultHeaders = { Authorization: `Bearer ${apiKey}` };
  }

  async createStream(args: StudioCreateStreamArgs): Promise<StudioStream> {
    const studioStream = await this._create<
      RawStudioStream,
      StudioCreateStreamArgs
    >('/stream', {
      json: args,
      headers: this._defaultHeaders,
    });
    return this._mapToStream(studioStream);
  }

  async updateStream(args: StudioUpdateStreamArgs): Promise<StudioStream> {
    const streamId = typeof args === 'string' ? args : args.streamId;

    await this._update(`/stream/${streamId}`, {
      json: {
        ...(typeof args?.record !== 'undefined'
          ? { record: Boolean(args.record) }
          : {}),
        ...(typeof args?.suspend !== 'undefined'
          ? { suspended: Boolean(args.suspend) }
          : {}),
      },
      headers: this._defaultHeaders,
    });

    return this.getStream(streamId);
  }

  async getStream(args: GetStreamArgs): Promise<StudioStream> {
    const rawStream = await this._get<RawStudioStream>(
      `/stream/${typeof args === 'string' ? args : args.streamId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return this._mapToStream(rawStream);
  }

  async getStreamSession(
    args: GetStreamSessionArgs,
  ): Promise<StudioStreamSession> {
    const session = await this._get<StudioStreamSession>(
      `/session/${typeof args === 'string' ? args : args.streamSessionId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return session;
  }

  async getStreamSessions(
    args: GetStreamSessionsArgs,
  ): Promise<StudioStreamSession[]> {
    const sessions = await this._get<StudioStreamSession[]>(
      `/stream/${typeof args === 'string' ? args : args.streamId}/sessions`,
      {
        headers: this._defaultHeaders,
      },
    );
    return sessions;
  }

  async createAsset(args: StudioCreateAssetArgs): Promise<StudioAsset> {
    const uploadReq = await this._create<
      { tusEndpoint: string; asset: { id: string }; task: { id: string } },
      Omit<CreateAssetArgs, 'file'>
    >('/asset/request-upload', {
      json: {
        name: args.name,
        meta: args.meta,
      },
      headers: this._defaultHeaders,
    });
    const {
      tusEndpoint,
      asset: { id: assetId },
      task: { id: taskId },
    } = uploadReq;

    await new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(args.file, {
        endpoint: tusEndpoint,
        metadata: {
          id: assetId,
        },
        uploadSize: args.uploadSize,

        onError(error) {
          reject(error);
        },
        onProgress(bytesSent, bytesTotal) {
          if (args.onUploadProgress) {
            args.onUploadProgress(bytesSent / bytesTotal);
          }
        },
        onSuccess() {
          return resolve();
        },
      });
      upload
        .findPreviousUploads()
        .then((previousUploads) => {
          if (previousUploads?.length > 0 && previousUploads[0]) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        })
        .catch(reject);
    });

    if (args.waitReady) {
      await this.waitTask({
        taskId,
        ...(typeof args.waitReady === 'object' ? args.waitReady : null),
      });
    }
    return this.getAsset(assetId);
  }

  async getAsset(args: GetAssetArgs): Promise<StudioAsset> {
    const asset = await this._get<StudioAsset>(
      `/asset/${typeof args === 'string' ? args : args.assetId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return asset;
  }

  async updateAsset(args: StudioUpdateAssetArgs): Promise<StudioAsset> {
    const { assetId, name, meta, storage } = args;
    const asset = await this._update<
      Omit<UpdateAssetArgs, 'assetId'>,
      StudioAsset
    >(`/asset/${assetId}`, {
      json: {
        name: typeof name !== 'undefined' ? String(name) : undefined,
        meta,
        storage,
      },
      headers: this._defaultHeaders,
    });

    const taskId = asset.storage?.status?.tasks.pending;
    if (!args.waitStorageReady || !taskId) {
      return asset;
    }

    await this.waitTask({
      taskId,
      ...(typeof args.waitStorageReady === 'object'
        ? args.waitStorageReady
        : null),
    });
    return this.getAsset(assetId);
  }

  // Studio-only APIs below

  /** List all streams in the account. Cannot be called with a CORS key. */
  async listStreams(
    args: StudioListArgs,
  ): Promise<StudioListPage<StudioStream>> {
    const { limit = 10, cursor = '' } = args;
    const streams = await this._list<StudioStream>(
      `/stream?limit=${limit}&cursor=${cursor}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return streams;
  }

  /** Deletes a stream object. Cannot be called with a CORS key. */
  deleteStream(args: StudioDeleteStreamArgs): Promise<void> {
    return this._delete(
      `/stream/${typeof args === 'string' ? args : args.streamId}`,
      {
        headers: this._defaultHeaders,
      },
    );
  }

  /** List all assets in the account. Cannot be called with a CORS key. */
  async listAssets(args: StudioListArgs): Promise<StudioListPage<StudioAsset>> {
    const { limit = 10, cursor = '' } = args;
    const assets = await this._list<StudioAsset>(
      `/asset?limit=${limit}&cursor=${cursor}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return assets;
  }

  /** Deletes an asset object. Cannot be called with a CORS key. */
  deleteAsset(args: StudioDeleteAssetArgs): Promise<void> {
    return this._delete(
      `/asset/${typeof args === 'string' ? args : args.assetId}`,
      {
        headers: this._defaultHeaders,
      },
    );
  }

  /** Gets a task by its ID */
  async getTask(args: GetTaskArgs): Promise<StudioTask> {
    const task = await this._get<StudioTask>(
      `/task/${typeof args === 'string' ? args : args.taskId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return task;
  }

  /** Waits until a specified task is completed and returns it. */
  async waitTask(args: WaitTaskArgs) {
    const start = Date.now();
    let task = await this.getTask(args);
    let lastProgress = 0;
    while (
      task.status?.phase !== 'completed' &&
      task.status?.phase !== 'failed'
    ) {
      if (args.timeout && Date.now() - start > args.timeout) {
        throw new Error('Timed out waiting for task completion');
      }
      const progress = task.status?.progress;
      if (progress && progress !== lastProgress) {
        if (args.onProgress) {
          args.onProgress(task);
        }
        lastProgress = progress;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
      task = await this.getTask(args);
    }

    if (task.status.phase === 'failed') {
      throw new Error(
        `${task.type} task failed. error: ${task.status.errorMessage}`,
      );
    }
    return task;
  }

  _getRtmpIngestUrl(streamKey: string) {
    return `rtmp://rtmp.livepeer.com/live/${streamKey}`;
  }

  _getPlaybackUrl(playbackId: string) {
    return `https://livepeercdn.com/hls/${playbackId}/index.m3u8`;
  }

  _mapToStream(studioStream: RawStudioStream): StudioStream {
    return {
      ...studioStream,
      rtmpIngestUrl: this._getRtmpIngestUrl(studioStream.streamKey),
      playbackUrl: this._getPlaybackUrl(studioStream.playbackId),
    };
  }

  private async _delete(
    url: `/${string}`,
    options?: FetchOptions<never>,
  ): Promise<void> {
    const response = await this._fetch(`${this._config.baseUrl}${url}`, {
      method: 'DELETE',
      ...options,
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        'Provider failed to get object',
        await response.json(),
      );
    }
  }

  private async _list<T>(
    url: `/${string}`,
    options?: FetchOptions<never>,
  ): Promise<StudioListPage<T>> {
    const response = await this._fetch(`${this._config.baseUrl}${url}`, {
      method: 'GET',
      ...options,
    });

    if (!response.ok) {
      throw new HttpError(
        response.status,
        'Provider failed to get object',
        await response.json(),
      );
    }

    return {
      entries: await response.json(),
      cursor: this._getNextCursor(response.headers.get('link')),
    };
  }

  private static linkRegex = /<([^>]+)>;\s*rel="next"/;

  private _getNextCursor(link: string | null): string {
    if (!link) {
      return '';
    }
    const match = link.match(StudioLivepeerProvider.linkRegex);
    if (!match || !match[1]) {
      return '';
    }
    const url = new URL(match[1]);
    return url.searchParams.get('cursor') ?? '';
  }
}

export function studioProvider(
  { apiKey }: StudioLivepeerProviderConfig = { apiKey: defaultStudioApiKey },
): LivepeerProviderFn<StudioLivepeerProvider> {
  if (!apiKey) throw new Error(`No API key provided for studio`);
  return () => new StudioLivepeerProvider(apiKey);
}
