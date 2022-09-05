import * as tus from 'tus-js-client';

import { defaultStudioApiKey, studio } from '../../constants';

import {
  CreateAssetArgs,
  GetAssetArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../../types';
import {
  MultistreamTargetRef,
  MultistreamTargetSpec,
} from '../../types/provider';

import { BaseLivepeerProvider, LivepeerProviderFn } from '../base';
import {
  StudioAsset,
  StudioCreateStreamArgs,
  StudioStream,
  StudioStreamSession,
} from './types';

export type StudioLivepeerProviderConfig = {
  apiKey?: string | null;
};

type RawStudioMultistreamTargetRef = Omit<MultistreamTargetSpec, 'spec'> & {
  id: string;
};

/** The API does not currently return these fields, so we have to generate them
 * through the _mapToStream function. */
type RawStudioStream = Omit<
  StudioStream,
  'rtmpIngestUrl' | 'playbackUrl' | 'multistream'
> & {
  multistream?: {
    targets: RawStudioMultistreamTargetRef[];
  };
};

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

  async updateStream(args: UpdateStreamArgs): Promise<StudioStream> {
    const streamId = typeof args === 'string' ? args : args.streamId;

    await this._update(`/stream/${streamId}`, {
      json: {
        ...(typeof args?.record !== 'undefined'
          ? { record: Boolean(args.record) }
          : {}),
        ...(typeof args?.suspend !== 'undefined'
          ? { suspended: Boolean(args.suspend) }
          : {}),
        ...(typeof args?.multistream !== 'undefined'
          ? {
              multistream: await this._mapToStudioMultistreamTargetsSpec(
                streamId,
                args.multistream.targets,
              ),
            }
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

  _getPlaybackUrl(playbackId: string) {
    return `https://livepeercdn.com/hls/${playbackId}/index.m3u8`;
  }

  async _mapToStream(studioStream: RawStudioStream): Promise<StudioStream> {
    const multistream = await this._mapToMultistream(studioStream.multistream);
    return {
      ...studioStream,
      multistream,
      rtmpIngestUrl: this._getRtmpIngestUrl(studioStream.streamKey),
      playbackUrl: this._getPlaybackUrl(studioStream.playbackId),
    };
  }

  private async _mapToMultistream(
    studioMultistream: RawStudioStream['multistream'],
  ): Promise<StudioStream['multistream'] | undefined> {
    if (!studioMultistream?.targets) {
      return undefined;
    }
    const targets = await Promise.all(
      studioMultistream.targets.map((t) => this._mapToMultistreamTargetRef(t)),
    );
    return { targets };
  }

  private async _mapToMultistreamTargetRef(
    studioTarget: RawStudioMultistreamTargetRef,
  ): Promise<MultistreamTargetRef> {
    const spec = await this._get<MultistreamTargetRef['spec']>(
      `/multistream/target/${studioTarget.id}`,
      {
        headers: this._defaultHeaders,
      },
    );
    return {
      profile: studioTarget.profile,
      videoOnly: studioTarget.videoOnly,
      spec,
    };
  }

  private async _mapToStudioMultistreamTargetsSpec(
    streamId: string,
    targets: (MultistreamTargetRef | MultistreamTargetSpec)[],
  ): Promise<(RawStudioMultistreamTargetRef | MultistreamTargetSpec)[]> {
    const stream = await this._get<RawStudioStream>(`/stream/${streamId}`, {
      headers: this._defaultHeaders,
    });
    const targetId = (t: MultistreamTargetRef) =>
      `${t.profile} -> ${t.spec.name}`;
    const existingTargets = !stream.multistream
      ? {}
      : Object.fromEntries<RawStudioMultistreamTargetRef>(
          await Promise.all(
            stream.multistream.targets.map(async (t) => {
              const mapped = await this._mapToMultistreamTargetRef(t);
              return [targetId(mapped), t] as const;
            }),
          ),
        );
    return targets.map((t) => {
      if ('url' in t.spec) {
        return t as MultistreamTargetSpec;
      }
      const existing = existingTargets[targetId(t as MultistreamTargetRef)];
      if (!existing) {
        throw new Error('Missing URL in new multistream target');
      }
      return existing;
    });
  }
}

export function studioProvider(
  { apiKey }: StudioLivepeerProviderConfig = { apiKey: defaultStudioApiKey },
): LivepeerProviderFn<StudioLivepeerProvider> {
  if (!apiKey) throw new Error(`No API key provided for studio`);
  return () => new StudioLivepeerProvider(apiKey);
}
