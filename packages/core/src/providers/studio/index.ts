import * as tus from 'tus-js-client';

import { defaultStudioConfig } from '../../constants';
import { isReactNative } from '../../media/browser';

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
  LivepeerProviderConfig,
  Metrics,
  PlaybackInfo,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
  ViewsMetrics,
} from '../../types';
import { hashCode } from '../../utils/hashcode';

import { BaseLivepeerProvider, LivepeerProviderFn } from '../base';
import {
  StudioAsset,
  StudioAssetPatchPayload,
  StudioCreateStreamArgs,
  StudioPlaybackInfo,
  StudioStream,
  StudioStreamSession,
  StudioViewsMetrics,
} from './types';

export type StudioLivepeerProviderConfig = LivepeerProviderConfig & {
  apiKey: string;
};

export class StudioLivepeerProvider extends BaseLivepeerProvider {
  readonly _defaultHeaders: { Authorization?: `Bearer ${string}` };

  constructor(config: StudioLivepeerProviderConfig) {
    super(config);

    this._defaultHeaders = config.apiKey
      ? { Authorization: `Bearer ${config.apiKey}` }
      : {};
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
        ...(typeof args?.playbackPolicy?.type !== 'undefined'
          ? {
              playbackPolicy: {
                type: args.playbackPolicy.type,
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
    if (args.url) {
      const createdAsset = await this._create<
        { asset: StudioAsset },
        Omit<CreateAssetArgs, 'file'>
      >('/asset/upload/url', {
        json: {
          name: args.name,
          url: args.url,
        },
        headers: this._defaultHeaders,
      });

      return this.getAsset(createdAsset?.asset?.id);
    }

    const uploadReq = await this._create<
      { tusEndpoint: string; asset: { id: string } },
      Omit<CreateAssetArgs, 'file'>
    >('/asset/request-upload', {
      json: {
        name: args.name,
      },
      headers: this._defaultHeaders,
    });
    const {
      tusEndpoint,
      asset: { id: assetId },
    } = uploadReq;

    await new Promise<void>((resolve, reject) => {
      if (!args.file) {
        return reject('No file provided.');
      }

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
        fingerprint: function (file) {
          if (isReactNative()) {
            return Promise.resolve(reactNativeFingerprint(file));
          } else {
            return Promise.resolve(
              [
                'browser',
                file.name,
                file.type,
                file.size,
                file.lastModified,
              ].join('-'),
            );
          }
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
    const { assetId, name, storage } = args;
    const asset = await this._update<
      Omit<StudioAssetPatchPayload, 'assetId'>,
      StudioAsset
    >(`/asset/${assetId}`, {
      json: {
        name: typeof name !== 'undefined' ? String(name) : undefined,
        storage: storage?.ipfs
          ? {
              ipfs: {
                spec: {
                  nftMetadata: storage?.metadata ?? {},
                  nftMetadataTemplate: storage?.metadataTemplate ?? 'player',
                },
              },
            }
          : undefined,
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

    const studioViewsMetrics = await this._get<StudioViewsMetrics>(
      `/data/views/${assetId}/total`,
      {
        headers: this._defaultHeaders,
      },
    );

    return this._mapToViewsMetrics(studioViewsMetrics);
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
        ...(studioPlaybackInfo?.['meta']?.['live']
          ? { live: Boolean(studioPlaybackInfo?.['meta']['live']) }
          : {}),
        source: studioPlaybackInfo?.['meta']?.['source']?.map((source) => ({
          hrn: source?.['hrn'],
          type: source?.['type'],
          url: source?.['url'],
        })),
      },
    };
  }

  _mapToViewsMetrics(studioMetrics: StudioViewsMetrics): ViewsMetrics {
    return {
      type: 'ViewsMetrics',
      metrics: studioMetrics,
    };
  }
}

const definedProps = (obj: object = {}) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => typeof v !== 'undefined'),
  );

export function studioProvider(
  config?: Partial<StudioLivepeerProviderConfig>,
): LivepeerProviderFn<StudioLivepeerProvider> {
  return () =>
    new StudioLivepeerProvider({
      ...defaultStudioConfig,
      ...definedProps(config),
    });
}

const reactNativeFingerprint = (file: any) => {
  const exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : 'noexif';
  return [
    'react-native',
    file.name || 'noname',
    file.size || 'nosize',
    exifHash,
  ].join('/');
};
