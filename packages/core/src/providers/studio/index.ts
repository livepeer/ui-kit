import * as tus from 'tus-js-client';

import { defaultStudioApiKey, studio } from '../../constants';

import {
  Asset,
  CreateAssetArgs,
  CreateStreamArgs,
  GetAssetArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../../types';

import { BaseLivepeerProvider, LivepeerProviderFn } from '../base';
import { StudioAsset, StudioStream, StudioStreamSession } from './types';

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

  async createStream(args: CreateStreamArgs): Promise<StudioStream> {
    const studioStream = await this._create<RawStudioStream, CreateStreamArgs>(
      '/stream',
      {
        json: args,
        headers: this._defaultHeaders,
      },
    );
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

  async createAsset(args: CreateAssetArgs): Promise<Asset> {
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
        { name: string }
      >('/asset/request-upload', {
        json: {
          name: args.name,
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

  async getAsset(args: GetAssetArgs): Promise<Asset> {
    const studioAsset = await this._get<StudioAsset>(
      `/asset/${typeof args === 'string' ? args : args.assetId}`,
      {
        headers: this._defaultHeaders,
      },
    );

    return this._mapToAsset(studioAsset);
  }

  async updateAsset(args: UpdateAssetArgs): Promise<Asset> {
    const assetId = typeof args === 'string' ? args : args.assetId;

    await this._update(`/asset/${assetId}`, {
      json: {
        ...(typeof args?.name !== 'undefined'
          ? { name: String(args.name) }
          : {}),
        ...(typeof args?.meta !== 'undefined' ? { meta: args.meta } : {}),
        ...(typeof args?.storage !== 'undefined'
          ? {
              storage: {
                ...(args.storage.ipfs ? { ipfs: {} } : {}),
              },
            }
          : {}),
      },
      headers: this._defaultHeaders,
    });

    return this.getAsset(assetId);
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

  _mapToAsset(studioAsset: StudioAsset): Asset {
    if (!studioAsset?.id || !studioAsset?.playbackId) {
      throw new Error('Asset did not have valid ID or playback ID');
    }

    return {
      id: studioAsset.id,
      playbackUrl: studioAsset?.playbackUrl,

      type: studioAsset?.['type'],
      playbackId: studioAsset?.['playbackId'],
      downloadUrl: studioAsset?.['downloadUrl'],
      storage: studioAsset?.['storage'],
      status: studioAsset?.['status'],
      name: studioAsset?.['name'],
      meta: studioAsset?.['meta'],
      createdAt: studioAsset?.['createdAt'],
      size: studioAsset?.['size'],
      hash: studioAsset?.['hash'],
      videoSpec: studioAsset?.['videoSpec'],
    };
  }
}

export function studioProvider(
  { apiKey }: StudioLivepeerProviderConfig = { apiKey: defaultStudioApiKey },
): LivepeerProviderFn<StudioLivepeerProvider> {
  if (!apiKey) throw new Error(`No API key provided for studio`);
  return () => new StudioLivepeerProvider(apiKey);
}
