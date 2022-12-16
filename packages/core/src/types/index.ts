export type Address = `0x${string}`;
export type Hash = `0x${string}`;

/**
 * Utility type for a fixed length array (based on an input array) with a certain type.
 */
export type MirrorSizeArray<TArray extends ReadonlyArray<any>, TType> = {
  [k in keyof TArray]: TType;
} & { length: TArray['length'] };

export type {
  Asset,
  CreateAssetArgs,
  CreateAssetFileProgress,
  CreateAssetProgress,
  CreateAssetProgressBase,
  CreateAssetSource,
  CreateAssetSourceBase,
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
  LivepeerProvider,
  LivepeerProviderConfig,
  Metrics,
  MultistreamTarget,
  MultistreamTargetRef,
  NativeFile,
  PlaybackInfo,
  PlaybackPolicy,
  Stream,
  StreamSession,
  TranscodingProfile,
  UpdateAssetArgs,
  UpdateStreamArgs,
  ViewsMetrics,
} from './provider';
