import type {
  Asset,
  CreateAssetArgs,
  GetAssetArgs,
  Ipfs,
  UpdateAssetArgs,
} from './asset';

import type {
  CreateStreamArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  Stream,
  StreamSession,
  TranscodingProfile,
  UpdateStreamArgs,
} from './stream';

export type LivepeerProviderConfig = {
  /** Provider name */
  name: string;
  /** Base URL for the provider */
  baseUrl: string;
};

export interface LivepeerProvider {
  /** The config for this provider */
  getConfig(): LivepeerProviderConfig;

  /** Create a new stream */
  createStream(args: CreateStreamArgs): Promise<Stream>;
  /** Modify a stream */
  updateStream(args: UpdateStreamArgs): Promise<Stream>;
  /** Get a stream by ID */
  getStream(args: GetStreamArgs): Promise<Stream>;
  /** Get a stream session by ID */
  getStreamSession(args: GetStreamSessionArgs): Promise<StreamSession>;
  /** List sessions for a specific parent stream ID */
  getStreamSessions(args: GetStreamSessionsArgs): Promise<StreamSession[]>;

  /** Create a new asset */
  createAsset(args: CreateAssetArgs): Promise<Asset>;
  /** Get an asset by ID */
  getAsset(args: GetAssetArgs): Promise<Asset>;
  /** Modify an asset */
  updateAsset(args: UpdateAssetArgs): Promise<Asset>;
}

export type {
  Asset,
  CreateAssetArgs,
  GetAssetArgs,
  Ipfs,
  TranscodingProfile,
  CreateStreamArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  Stream,
  StreamSession,
  UpdateAssetArgs,
  UpdateStreamArgs,
};
