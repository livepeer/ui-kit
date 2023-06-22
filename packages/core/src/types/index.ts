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
  Attestation,
  AttestationRole,
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
  CreatorId,
  Domain,
  GetAssetArgs,
  GetAssetMetricsArgs,
  GetPlaybackInfoArgs,
  GetStreamArgs,
  GetStreamSessionArgs,
  GetStreamSessionsArgs,
  JwtOrPublicPlaybackPolicy,
  LivepeerProvider,
  LivepeerProviderConfig,
  Message,
  Metrics,
  MultistreamTarget,
  MultistreamTargetRef,
  NativeFile,
  PlaybackAccessControlRequest,
  PlaybackInfo,
  PlaybackPolicy,
  Stream,
  StreamSession,
  TranscodingProfile,
  UpdateAssetArgs,
  UpdateStreamArgs,
  ViewsMetrics,
  WebhookPlaybackPolicy,
} from './provider';
