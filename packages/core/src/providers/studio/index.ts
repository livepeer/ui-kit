import * as tus from 'tus-js-client';

import { defaultStudioApiKey, studio } from '../../constants';

import {
  Asset,
  CreateAssetArgs,
  CreateStreamArgs,
  GetAssetArgs,
  GetAssetMetricsArgs,
  GetPlaybackInfoArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  Metrics,
  PlaybackInfo,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../../types';

import { BaseLivepeerProvider, LivepeerProviderFn } from '../base';
import {
  StudioAsset,
  StudioCreateStreamArgs,
  StudioMetrics,
  StudioPlaybackInfo,
  StudioStream,
  StudioStreamSession,
} from './types';

export type StudioLivepeerProviderConfig = {
  apiKey?: string | null;
};

export class StudioLivepeerProvider extends BaseLivepeerProvider {
  readonly _apiKey: string;
  readonly _defaultHeaders: { Authorization: `Bearer ${string}` };

  constructor(apiKey: string) {
    super(studio);

    this._apiKey = apiKey;
    this._defaultHeaders = { Authorization: `Bearer ${apiKey}` };
  }

  async createStream(args: CreateStreamArgs): Promise<Stream> {
    const studioStream = await this._create<
      StudioStream,
      StudioCreateStreamArgs
    >('/stream', {
      json: args,
      headers: this._defaultHeaders,
    });
    return this._mapToStream(studioStream);
  }

  async updateStream(args: UpdateStreamArgs): Promise<Stream> {
    const streamId = typeof args === 'string' ? args : args.streamId;

    await this._update(`/stream/${streamId}`, {
      json: {
        ...(typeof args?.record !== 'undefined'
          ? { record: Boolean(args.record) }
          : {}),
        ...(typeof args?.suspend !== 'undefined'
          ? { suspended: Boolean(args.suspend) }
          : {}),
        ...(typeof args?.multistream?.targets !== 'undefined'
          ? {
              multistream: {
                targets: args.multistream.targets.map((t) =>
                  typeof t.id === 'undefined' || 'url' in (t.spec ?? {})
                    ? { ...t, id: undefined }
                    : { ...t, spec: undefined },
                ),
              },
            }
          : {}),
      },
      headers: this._defaultHeaders,
    });

    return this.getStream(streamId);
  }

  async getStream(args: GetStreamArgs): Promise<Stream> {
    const studioStream = await this._get<StudioStream>(
      `/stream/${typeof args === 'string' ? args : args.streamId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return this._mapToStream(studioStream);
  }

  async getStreamSession(args: GetStreamSessionArgs): Promise<StreamSession> {
    const studioStreamSession = await this._get<StudioStreamSession>(
      `/session/${typeof args === 'string' ? args : args.streamSessionId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return studioStreamSession;
  }

  async getStreamSessions(
    args: GetStreamSessionsArgs,
  ): Promise<StreamSession[]> {
    const studioStreamSessions = await this._get<StudioStreamSession[]>(
      `/stream/${typeof args === 'string' ? args : args.streamId}/sessions`,
      {
        headers: this._defaultHeaders,
      },
    );
    return studioStreamSessions;
  }

  async createAsset(args: CreateAssetArgs): Promise<Asset> {
    const uploadReq = await this._create<
      { tusEndpoint: string; asset: { id: string } },
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
    } = uploadReq;

    await new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(args.file, {
        endpoint: tusEndpoint,
        metadata: {
          id: assetId,
        },
        uploadSize: args.uploadSize,
        // Chunk size is required if input is a stream (and S3 min is 5MB), but
        // not recommended if it is a file.
        ...(args.file instanceof File ? null : { chunkSize: 5 * 1024 * 1024 }),

        onError(error) {
          reject(error);
        },
        onProgress(bytesSent, bytesTotal) {
          args?.onUploadProgress?.(bytesSent / bytesTotal);
        },
        onSuccess() {
          args?.onUploadProgress?.(1);
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
    return this.getAsset(assetId);
  }

  async getAsset(args: GetAssetArgs): Promise<Asset> {
    const studioAsset = await this._get<StudioAsset>(
      `/asset/${typeof args === 'string' ? args : args.assetId}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return studioAsset;
  }

  async updateAsset(args: UpdateAssetArgs): Promise<Asset> {
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
    return asset;
  }

  _getRtmpIngestUrl(streamKey: string) {
    return `rtmp://rtmp.livepeer.com/live/${streamKey}`;
  }

  async getPlaybackInfo(args: GetPlaybackInfoArgs): Promise<PlaybackInfo> {
    const playbackId = typeof args === 'string' ? args : args.playbackId;

    const studioPlaybackInfo = await this._get<StudioPlaybackInfo>(
      `/playback/${playbackId}`,
      {
        headers: this._defaultHeaders,
      },
    );

    return this._mapToPlaybackInfo(studioPlaybackInfo);
  }

  _getPlaybackUrl(playbackId: string) {
    return `https://livepeercdn.com/hls/${playbackId}/index.m3u8`;
  }

  async getAssetMetrics(args: GetAssetMetricsArgs): Promise<Metrics> {
    const assetId = typeof args === 'string' ? args : args.assetId;

    const studioMetrics = await this._get<StudioMetrics>(
      `/data/views/${assetId}/total`,
      {
        headers: this._defaultHeaders,
      },
    );

    return this._mapToMetrics(studioMetrics);
  }

  async _mapToStream(studioStream: StudioStream): Promise<Stream> {
    return {
      ...studioStream,
      multistream: await this._mapToMultistream(studioStream.multistream),
      rtmpIngestUrl: this._getRtmpIngestUrl(studioStream.streamKey),
      playbackUrl: this._getPlaybackUrl(studioStream.playbackId),
    };
  }

  private async _mapToMultistream(
    studioMultistream: StudioStream['multistream'],
  ): Promise<Stream['multistream'] | undefined> {
    if (!studioMultistream?.targets) {
      return undefined;
    }
    const fetchTargets = studioMultistream.targets.map(async (t) => {
      const { name } = await this._get<{ name: string }>(
        `/multistream/target/${t.id}`,
        { headers: this._defaultHeaders },
      );
      return { ...t, spec: { name } };
    });
    return { targets: await Promise.all(fetchTargets) };
  }

  _mapToPlaybackInfo(studioPlaybackInfo: StudioPlaybackInfo): PlaybackInfo {
    return {
      type: studioPlaybackInfo?.['type'],
      meta: {
        live: studioPlaybackInfo?.['meta']?.['live']
          ? Boolean(studioPlaybackInfo?.['meta']['live'])
          : undefined,
        source: studioPlaybackInfo?.['meta']?.['source']?.map((source) => ({
          hrn: source?.['hrn'],
          type: source?.['type'],
          url: source?.['url'],
        })),
      },
    };
  }

  _mapToMetrics(studioMetrics: StudioMetrics): Metrics {
    return {
      ...studioMetrics,
    };
  }
}

export function studioProvider(
  config?: StudioLivepeerProviderConfig,
): LivepeerProviderFn<StudioLivepeerProvider> {
  return () =>
    new StudioLivepeerProvider(config?.apiKey ?? defaultStudioApiKey);
}
