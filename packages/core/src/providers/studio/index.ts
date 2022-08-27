import * as tus from 'tus-js-client';

import { defaultStudioApiKey, studio } from '../../constants';

import {
  CreateAssetArgs,
  GetAssetArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  UpdateAssetArgs,
} from '../../types';

import { BaseLivepeerProvider, LivepeerProviderFn } from '../base';
import {
  GetTaskArgs,
  StudioAsset,
  StudioCreateStreamArgs,
  StudioStream,
  StudioStreamSession,
  StudioTask,
  StudioUpdateStreamArgs,
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

  async createAsset(args: CreateAssetArgs): Promise<StudioAsset> {
    const tusOptions: tus.UploadOptions = {};

    const existingUpload = new tus.Upload(args.file, {});
    const previousUploads = await existingUpload.findPreviousUploads();

    let assetId: string | undefined;

    if (previousUploads.length > 0 && previousUploads[0]) {
      const previousUpload = previousUploads[0];

      assetId = previousUpload.metadata.id;

      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(args.file, {
          ...tusOptions,
          onError(error) {
            reject(error);
          },
          onSuccess() {
            return resolve();
          },
        });

        upload.resumeFromPreviousUpload(previousUpload);
        upload.start();
      });
    } else {
      const requestUploadEndpoint = await this._create<
        { tusEndpoint: string; asset: { id: string } },
        Omit<CreateAssetArgs, 'file'>
      >('/asset/request-upload', {
        json: {
          name: args.name,
          meta: args.meta,
        },
        headers: this._defaultHeaders,
      });

      assetId = requestUploadEndpoint.asset.id;

      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(args.file, {
          metadata: {
            id: requestUploadEndpoint.asset.id,
          },
          ...tusOptions,
          endpoint: requestUploadEndpoint.tusEndpoint,

          onError(error) {
            reject(error);
          },
          onSuccess() {
            return resolve();
          },
        });

        upload.start();
      });
    }

    if (!assetId) {
      throw new Error('Could not find asset ID');
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

  async updateAsset(args: UpdateAssetArgs): Promise<StudioAsset> {
    const { assetId, name, meta, storage } = args;
    await this._update(`/asset/${assetId}`, {
      json: {
        name: typeof name !== 'undefined' ? String(name) : undefined,
        meta,
        storage,
      },
      headers: this._defaultHeaders,
    });

    return this.getAsset(assetId);
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
}

export function studioProvider(
  { apiKey }: StudioLivepeerProviderConfig = { apiKey: defaultStudioApiKey },
): LivepeerProviderFn<StudioLivepeerProvider> {
  if (!apiKey) throw new Error(`No API key provided for studio`);
  return () => new StudioLivepeerProvider(apiKey);
}
