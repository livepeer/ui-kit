import * as tus from 'tus-js-client';

import { defaultStudioApiKey, lpms } from '../../constants';

import {
  Asset,
  CreateAssetArgs,
  CreateStreamArgs,
  GetAssetArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../../types';

import { BaseLPMSProvider, LPMSProviderFn } from '../base';
import { StudioAsset, StudioStream, StudioStreamSession } from './types';

export type StudioLPMSProviderConfig = {
  apiKey?: string | null;
};

export class StudioLPMSProvider extends BaseLPMSProvider {
  readonly _apiKey: string;
  readonly _defaultHeaders: { Authorization: `Bearer ${string}` };

  constructor(apiKey: string) {
    super(lpms.studio);

    this._apiKey = apiKey;
    this._defaultHeaders = { Authorization: `Bearer ${apiKey}` };
  }

  async createStream(args: CreateStreamArgs): Promise<Stream> {
    const studioStream = await this._create<StudioStream, CreateStreamArgs>(
      '/stream',
      {
        json: args,
        headers: this._defaultHeaders,
      },
    );

    return this._mapToStream(studioStream);
  }

  async updateStream(args: UpdateStreamArgs): Promise<void> {
    return this._update(
      `/stream/${typeof args === 'string' ? args : args.streamId}`,
      {
        json: {
          ...(typeof args?.record !== 'undefined'
            ? { record: Boolean(args.record) }
            : {}),
          ...(typeof args?.suspended !== 'undefined'
            ? { suspended: Boolean(args.suspended) }
            : {}),
        },
        headers: this._defaultHeaders,
      },
    );
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

    return this._mapToStreamSession(studioStreamSession);
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

    return studioStreamSessions.map((studioStreamSession) =>
      this._mapToStreamSession(studioStreamSession),
    );
  }

  async createAsset(args: CreateAssetArgs): Promise<Asset> {
    const tusOptions: tus.UploadOptions = {
      uploadSize: args.file.size,
    };

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

  async updateAsset(args: UpdateAssetArgs): Promise<void> {
    return this._update(
      `/asset/${typeof args === 'string' ? args : args.assetId}`,
      {
        json: {
          ...(typeof args?.name !== 'undefined'
            ? { name: String(args.name) }
            : {}),
          ...(typeof args?.meta !== 'undefined' ? { meta: args.meta } : {}),
          ...(typeof args?.storage !== 'undefined'
            ? { storage: args.storage === 'ipfs' ? { ipfs: {} } : {} }
            : {}),
        },
        headers: this._defaultHeaders,
      },
    );
  }

  _getPlaybackUrl(playbackId: string) {
    return `https://livepeercdn.com/hls/${playbackId}/index.m3u8`;
  }

  _mapToStream(studioStream: StudioStream): Stream {
    if (!studioStream?.id || !studioStream?.playbackId) {
      throw new Error('Stream did not have valid ID or playback ID');
    }

    return {
      playbackUrl: this._getPlaybackUrl(studioStream?.playbackId),

      id: studioStream?.['id'],
      kind: studioStream?.['kind'],
      name: studioStream?.['name'],
      lastSeen: studioStream?.['lastSeen'],
      sourceSegments: studioStream?.['sourceSegments'],
      transcodedSegments: studioStream?.['transcodedSegments'],
      sourceSegmentsDuration: studioStream?.['sourceSegmentsDuration'],
      transcodedSegmentsDuration: studioStream?.['transcodedSegmentsDuration'],
      sourceBytes: studioStream?.['sourceBytes'],
      transcodedBytes: studioStream?.['transcodedBytes'],
      ingestRate: studioStream?.['ingestRate'],
      outgoingRate: studioStream?.['outgoingRate'],
      deleted: studioStream?.['deleted'],
      isActive: studioStream?.['isActive'],
      createdByTokenName: studioStream?.['createdByTokenName'],
      createdByTokenId: studioStream?.['createdByTokenId'],
      createdAt: studioStream?.['createdAt'],
      parentId: studioStream?.['parentId'],
      partialSession: studioStream?.['partialSession'],
      previousSessions: studioStream?.['previousSessions'],
      streamKey: studioStream?.['streamKey'],
      playbackId: studioStream?.['playbackId'],
      profiles: studioStream?.['profiles'],
      objectStoreId: studioStream?.['objectStoreId'],
      presets: studioStream?.['presets'],
      record: studioStream?.['record'],
      recordObjectStoreId: studioStream?.['recordObjectStoreId'],
      multistream: studioStream?.['multistream'],
    };
  }

  _mapToStreamSession(studioStreamSession: StudioStreamSession): StreamSession {
    if (!studioStreamSession?.id || !studioStreamSession?.playbackId) {
      throw new Error('Stream session did not have valid ID or playback ID');
    }

    return {
      playbackUrl: this._getPlaybackUrl(studioStreamSession?.playbackId),

      id: studioStreamSession.id,
      kind: studioStreamSession?.['kind'],
      name: studioStreamSession?.['name'],
      lastSeen: studioStreamSession?.['lastSeen'],
      sourceSegments: studioStreamSession?.['sourceSegments'],
      transcodedSegments: studioStreamSession?.['transcodedSegments'],
      sourceSegmentsDuration: studioStreamSession?.['sourceSegmentsDuration'],
      transcodedSegmentsDuration:
        studioStreamSession?.['transcodedSegmentsDuration'],
      sourceBytes: studioStreamSession?.['sourceBytes'],
      transcodedBytes: studioStreamSession?.['transcodedBytes'],
      ingestRate: studioStreamSession?.['ingestRate'],
      outgoingRate: studioStreamSession?.['outgoingRate'],
      deleted: studioStreamSession?.['deleted'],
      createdAt: studioStreamSession?.['createdAt'],
      parentId: studioStreamSession?.['parentId'],
      record: studioStreamSession?.['record'],
      recordingStatus: studioStreamSession?.['recordingStatus'],
      recordingUrl: studioStreamSession?.['recordingUrl'],
      mp4Url: studioStreamSession?.['mp4Url'],
      recordObjectStoreId: studioStreamSession?.['recordObjectStoreId'],
      playbackId: studioStreamSession?.['playbackId'],
      profiles: studioStreamSession?.['profiles'],
      lastSessionId: studioStreamSession?.['lastSessionId'],
    };
  }

  _mapToAsset(studioAsset: StudioAsset): Asset {
    if (!studioAsset?.id || !studioAsset?.playbackId) {
      throw new Error('Asset did not have valid ID or playback ID');
    }

    return {
      id: studioAsset.id,
      playbackUrl: this._getPlaybackUrl(studioAsset?.playbackId),

      type: studioAsset?.['type'],
      playbackId: studioAsset?.['playbackId'],
      playbackRecordingId: studioAsset?.['playbackRecordingId'],
      downloadUrl: studioAsset?.['downloadUrl'],
      deleted: studioAsset?.['deleted'],
      objectStoreId: studioAsset?.['objectStoreId'],
      storage: studioAsset?.['storage'],
      status: studioAsset?.['status'],
      name: studioAsset?.['name'],
      meta: studioAsset?.['meta'],
      createdAt: studioAsset?.['createdAt'],
      size: studioAsset?.['size'],
      hash: studioAsset?.['hash'],
      videoSpec: studioAsset?.['videoSpec'],
      sourceAssetId: studioAsset?.['sourceAssetId'],
    };
  }
}

export function studioProvider(
  { apiKey }: StudioLPMSProviderConfig = { apiKey: defaultStudioApiKey },
): LPMSProviderFn<StudioLPMSProvider> {
  if (!apiKey) throw new Error(`No API key provided for studio`);
  return () => new StudioLPMSProvider(apiKey);
}
