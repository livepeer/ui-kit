export type Address = `0x${string}`;
export type Hash = `0x${string}`;

export type {
  Asset,
  CreateAssetArgs,
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
  PlaybackInfo,
  Stream,
  StreamSession,
  TranscodingProfile,
  UpdateAssetArgs,
  UpdateStreamArgs,
  ViewsMetrics,
} from './provider';
