import * as tus from 'tus-js-client';

import type {
  StudioAsset,
  StudioAssetPatchPayload,
  StudioCreateAssetArgs,
  StudioCreateAssetUrlArgs,
  StudioCreateStreamArgs,
  StudioPlaybackInfo,
  StudioStream,
  StudioStreamSession,
  StudioViewsMetrics,
} from './types';
import { defaultStudioConfig } from '../../constants';

import type {
  Asset,
  CreateAssetArgs,
  CreateAssetFileProgress,
  CreateAssetProgress,
  CreateAssetProgressBase,
  CreateAssetSourceFile,
  CreateAssetSourceType,
  CreateAssetSourceUrl,
  CreateAssetUrlProgress,
  CreateStreamArgs,
  GetAssetArgs,
  GetAssetMetricsArgs,
  GetPlaybackInfoArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  LivepeerProviderConfig,
  Metrics,
  MirrorSizeArray,
  PlaybackInfo,
  PlaybackPolicy,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
  ViewsMetrics,
} from '../../types';

import { BaseLivepeerProvider, LivepeerProviderFn } from '../base';

export type StudioLivepeerProviderConfig = LivepeerProviderConfig & {
  apiKey: string;
};

const DEFAULT_CHUNK_SIZE = 100 * 1024 * 1024;

export class StudioLivepeerProvider extends BaseLivepeerProvider {
  readonly _defaultHeaders: {
    Authorization?: `Bearer ${string}`;
    Origin?: string;
  };

  constructor(config: StudioLivepeerProviderConfig & Record<string, string>) {
    super(config);

    this._defaultHeaders = {
      ...(config.apiKey
        ? {
            Authorization: `Bearer ${config.apiKey}`,
          }
        : {}),
      ...(config.origin
        ? {
            Origin: config.origin,
          }
        : {}),
    };
  }

  async createStream(args: CreateStreamArgs): Promise<Stream> {
    const playbackPolicy = this._getPlaybackPolicyMapped(args.playbackPolicy);
    const studioStream = await this._create<
      StudioStream,
      StudioCreateStreamArgs
    >('/stream', {
      json: {
        ...args,
        ...(playbackPolicy ? { playbackPolicy } : {}),
        ...(args.creatorId ? { creatorId: args.creatorId } : {}),
      },
      headers: this._defaultHeaders,
    });
    return this._mapToStream(studioStream);
  }

  async updateStream(args: UpdateStreamArgs): Promise<Stream> {
    const streamId = typeof args === 'string' ? args : args.streamId;
    const playbackPolicy = this._getPlaybackPolicyMapped(args.playbackPolicy);

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

        ...(playbackPolicy ? { playbackPolicy } : {}),
        ...(args.creatorId ? { creatorId: args.creatorId } : {}),
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

  async createAsset<TSource extends CreateAssetSourceType>(
    args: CreateAssetArgs<TSource>,
  ): Promise<MirrorSizeArray<TSource, Asset>> {
    const { sources, onProgress, noWait, chunkSize } = args;

    let progress = sources.map((source) => ({
      name: source.name,
      progress: 0,
      assetId: null,
      phase: (source as CreateAssetSourceUrl)?.url ? 'waiting' : 'uploading',
    })) as CreateAssetProgress<TSource>;

    // upload all assets and do not throw for failed
    const pendingAssetIds = await Promise.allSettled(
      sources.map(async (source, index) => {
        const playbackPolicy = this._getPlaybackPolicyMapped(
          source.playbackPolicy,
        );

        if ((source as CreateAssetSourceUrl).url) {
          const createdAsset = await this._create<
            { asset: StudioAsset },
            StudioCreateAssetUrlArgs
          >('/asset/upload/url', {
            json: {
              name: source.name,
              url: (source as CreateAssetSourceUrl).url,
              storage: source?.storage?.ipfs
                ? {
                    ipfs: {
                      spec: {
                        nftMetadata: source?.storage?.metadata ?? {},
                        ...(source?.storage?.metadataTemplate
                          ? {
                              nftMetadataTemplate:
                                source.storage.metadataTemplate,
                            }
                          : {}),
                      },
                    },
                  }
                : undefined,
              ...(playbackPolicy ? { playbackPolicy } : {}),
              ...(source.creatorId ? { creatorId: source.creatorId } : {}),
            },
            headers: this._defaultHeaders,
          });

          return createdAsset?.asset?.id;
        } else {
          const uploadReq = await this._create<
            { tusEndpoint: string; asset: { id: string } },
            StudioCreateAssetArgs
          >('/asset/request-upload', {
            json: {
              name: source.name,
              storage: source?.storage?.ipfs
                ? {
                    ipfs: {
                      spec: {
                        nftMetadata: source?.storage?.metadata ?? {},
                        ...(source?.storage?.metadataTemplate
                          ? {
                              nftMetadataTemplate:
                                source.storage.metadataTemplate,
                            }
                          : {}),
                      },
                    },
                  }
                : undefined,
              ...(playbackPolicy ? { playbackPolicy } : {}),
              ...(source.creatorId ? { creatorId: source.creatorId } : {}),
            },
            headers: this._defaultHeaders,
          });

          const {
            tusEndpoint,
            asset: { id: assetId },
          } = uploadReq;

          await new Promise<void>((resolve, reject) => {
            const upload = new tus.Upload(
              (source as CreateAssetSourceFile).file as File,
              {
                endpoint: tusEndpoint,
                metadata: {
                  id: assetId,
                },
                ...(chunkSize
                  ? { chunkSize }
                  : typeof navigator !== 'undefined' &&
                    typeof navigator.product === 'string' &&
                    navigator.product.toLowerCase() === 'reactnative'
                  ? null
                  : { chunkSize: DEFAULT_CHUNK_SIZE }),
                // fingerprint: function (file: File & { exif?: any }) {
                //   return fingerprint(file);
                // },
                onError: (error) => {
                  console.log('Failed because: ', error);
                },
                // TODO add configurable url storage for nodejs
                onProgress(bytesSent, bytesTotal) {
                  const progressPercent = bytesSent / bytesTotal;

                  const status: CreateAssetFileProgress = {
                    name: source.name,
                    assetId,
                    progress: progressPercent,
                    phase: 'uploading',
                  };

                  const newSources = [
                    ...(progress as CreateAssetProgressBase[]),
                  ];

                  newSources[index] = status;

                  progress = newSources as {
                    [K in keyof TSource]: TSource[K] extends CreateAssetSourceUrl
                      ? CreateAssetUrlProgress
                      : CreateAssetFileProgress;
                  };

                  onProgress?.(progress);
                },

                onSuccess() {
                  resolve();
                },
              },
            );

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

          return assetId;
        }
      }),
    );

    if (noWait) {
      return Promise.all(
        pendingAssetIds.map(async (assetIdResult) => {
          if (assetIdResult.status === 'rejected') {
            throw assetIdResult.reason;
          }
          return this.getAsset(assetIdResult.value);
        }),
      ) as Promise<MirrorSizeArray<TSource, Asset>>;
    }

    const MAX_ERROR_COUNT = 5;

    // wait for all assets to complete uploading before returning
    const assets = await Promise.allSettled(
      pendingAssetIds.map(async (assetIdResult, index) => {
        if (assetIdResult.status === 'rejected') {
          throw assetIdResult.reason;
        }

        let asset: Asset | null = null;
        let errorCount = 0;

        while (
          asset?.status?.phase !== 'ready' &&
          asset?.status?.phase !== 'failed'
        ) {
          try {
            // wait w/ random jitter
            await new Promise((resolve) =>
              setTimeout(resolve, Math.random() * 1000 + 4000),
            );

            asset = await this.getAsset(assetIdResult.value);

            if (typeof asset.status?.phase !== 'undefined') {
              const status: CreateAssetUrlProgress = {
                name: asset.name,
                assetId: asset.id,
                progress: asset.status.progress ?? 0,
                phase: asset.status.phase,
              };

              const newSources = [...(progress as CreateAssetProgressBase[])];

              newSources[index] = status;

              progress = newSources as {
                [K in keyof TSource]: TSource[K] extends CreateAssetSourceUrl
                  ? CreateAssetUrlProgress
                  : CreateAssetFileProgress;
              };

              onProgress?.(progress);
            } else {
              throw new Error('Asset phase was undefined.');
            }
          } catch (e) {
            // hits the max error limit and throws the error
            if (errorCount > MAX_ERROR_COUNT) {
              throw e;
            }
            errorCount += 1;
          }
        }

        const status: CreateAssetUrlProgress = {
          name: asset.name,
          assetId: asset.id,
          progress: 1,
          phase: asset.status.phase,
        };

        const newSources = [...(progress as CreateAssetProgressBase[])];

        newSources[index] = status;

        progress = newSources as {
          [K in keyof TSource]: TSource[K] extends CreateAssetSourceUrl
            ? CreateAssetUrlProgress
            : CreateAssetFileProgress;
        };

        onProgress?.(progress);

        return asset as Asset;
      }),
    );

    const mappedAssets = [
      ...assets.map((asset) => {
        if (asset.status === 'fulfilled') {
          return asset.value;
        } else {
          throw asset.reason;
        }
      }),
    ] as const;

    return mappedAssets as MirrorSizeArray<TSource, Asset>;
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
    const playbackPolicy = this._getPlaybackPolicyMapped(args.playbackPolicy);
    await this._update<Omit<StudioAssetPatchPayload, 'assetId'>>(
      `/asset/${assetId}`,
      {
        json: {
          name: typeof name !== 'undefined' ? String(name) : undefined,
          storage: storage?.ipfs
            ? {
                ipfs: {
                  spec: {
                    nftMetadata: storage?.metadata ?? {},
                    ...(storage?.metadataTemplate
                      ? {
                          nftMetadataTemplate: storage.metadataTemplate,
                        }
                      : {}),
                  },
                },
              }
            : undefined,
          ...(playbackPolicy ? { playbackPolicy } : {}),
          ...(args.creatorId ? { creatorId: args.creatorId } : {}),
        },
        headers: this._defaultHeaders,
      },
    );
    return this.getAsset({ assetId });
  }

  _getRtmpIngestUrl(streamKey: string) {
    return `rtmp://rtmp.livepeer.com/live/${streamKey}`;
  }

  async getPlaybackInfo(args: GetPlaybackInfoArgs): Promise<PlaybackInfo> {
    const playbackId = typeof args === 'string' ? args : args.playbackId;

    const urlEncodedPlaybackId = encodeURIComponent(playbackId);

    const studioPlaybackInfo = await this._get<StudioPlaybackInfo>(
      `/playback/${urlEncodedPlaybackId}`,
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
        ...studioPlaybackInfo?.['meta'],
        live: Boolean(studioPlaybackInfo?.['meta']?.['live']),
        source: studioPlaybackInfo?.['meta']?.['source']?.map((source) => ({
          ...source,
        })),
        attestation: studioPlaybackInfo?.['meta']?.['attestation'],
      },
    };
  }

  _mapToViewsMetrics(studioMetrics: StudioViewsMetrics): ViewsMetrics {
    return {
      type: 'ViewsMetrics',
      metrics: studioMetrics,
    };
  }

  _getPlaybackPolicyMapped(
    policy: PlaybackPolicy | undefined,
  ): PlaybackPolicy | null {
    return policy && typeof policy?.type !== 'undefined'
      ? policy.type === 'webhook'
        ? {
            type: policy.type,
            webhookId: policy.webhookId,
            webhookContext: policy.webhookContext,
          }
        : {
            type: policy.type,
          }
      : null;
  }
}

export function studioProvider(
  config: Partial<Omit<StudioLivepeerProviderConfig, 'apiKey'>> &
    Pick<StudioLivepeerProviderConfig, 'apiKey'>,
): LivepeerProviderFn<StudioLivepeerProvider> {
  return () =>
    new StudioLivepeerProvider({
      ...defaultStudioConfig,
      ...config,
    });
}
