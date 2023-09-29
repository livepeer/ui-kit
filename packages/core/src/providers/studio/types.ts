import {
  Asset,
  Attestation,
  CreateStreamArgs,
  CreatorId,
  MultistreamTargetRef,
  Stream,
  StreamSession,
  TranscodingProfile,
  ViewsMetrics,
} from '../../types';

/**
 * Studio ffmpeg profile for transcoding.
 */
export type StudioFfmpegProfile = TranscodingProfile & {
  /** Size of the GOP (group of pictures) to generate in output */
  gop?: string;
  /** Codec for output profile. Defaults to h264 */
  encoder?: 'h264' | 'hevc' | 'vp8' | 'vp9';
  /** Encoding H.264 profile to use */
  profile?: 'H264Baseline' | 'H264Main' | 'H264High' | 'H264ConstrainedHigh';
};

export interface StudioStream
  extends Omit<Stream, 'rtmpIngestUrl' | 'playbackUrl' | 'multistream'> {
  profiles: StudioFfmpegProfile[];
  /**
   * Name of the token used to create this object.
   */
  createdByTokenName?: string;
  multistream?: {
    targets: Omit<MultistreamTargetRef, 'spec'>[];
  };
}

export type StudioDeactivateManyPayload = {
  ids?: [string, ...string[]];
};

export type StudioStreamSetActivePayload = {
  /**
   * If currently active
   */
  active: boolean;
  /**
   * Hostname of the Mist server that processes that stream
   */
  hostName?: string;
  /**
   * Timestamp (in milliseconds) at which the stream started.
   */
  startedAt?: number;
  [k: string]: unknown;
};

export type StudioStorageConfig = {
  ipfs?:
    | {
        spec?: null | {
          /**
           * Name of the NFT metadata template to export. 'player' will embed the Livepeer Player on the NFT while 'file' will reference only the immutable MP4 files.
           */
          nftMetadataTemplate?: 'player' | 'file';
          /**
           * Additional data to add to the NFT metadata exported to IPFS. Will be deep merged with the default metadata exported.
           */
          nftMetadata?: {
            [k: string]: unknown;
          };
        };
      }
    | (boolean | null);
};

export type StudioAssetPatchPayload = {
  /**
   * Name of the asset. This is not necessarily the filename, can be a custom name or title
   */
  name?: string;
  /** Storage configs for the asset */
  storage?: StudioStorageConfig;
  /** The creator ID for the asset */
  creatorId?: CreatorId;
};

export type StudioCreateAssetArgs = {
  /**
   * Name of the asset. This is not necessarily the filename, can be a custom name or title
   */
  name: string;
  /** Storage configs for the asset */
  storage?: StudioStorageConfig;
  /** The creator ID for the asset */
  creatorId?: CreatorId;
};

export type StudioCreateAssetUrlArgs = {
  /**
   * Name of the asset. This is not necessarily the filename, can be a custom name or title
   */
  name: string;
  /** External URL to be imported */
  url: string;
  /** Storage configs for the asset */
  storage?: StudioStorageConfig;
  /** The creator ID for the asset */
  creatorId?: CreatorId;
};

export interface StudioCreateStreamArgs extends CreateStreamArgs {
  profiles?: StudioFfmpegProfile[];
}

export interface StudioStreamSession extends StreamSession {
  profiles: StudioFfmpegProfile[];
  /**
   * Name of the token used to create this object.
   */
  createdByTokenName?: string;
}

export type StudioError = {
  errors: [string, ...string[]];
};

export type StudioAsset = Asset;

export type StudioPlaybackInfo = {
  type: 'live' | 'vod' | 'recording';
  meta: {
    live?: 0 | 1;
    source: {
      hrn: 'HLS (TS)' | 'MP4' | 'WebRTC (H264)';
      type:
        | 'html5/application/vnd.apple.mpegurl'
        | 'html5/video/mp4'
        | 'html5/video/h264';
      url: string;
      size?: number;
      width?: number;
      height?: number;
      bitrate?: number;
    }[];
    dvrPlayback?: {
      hrn: string;
      type: 'html5/application/vnd.apple.mpegurl';
      url: string;
    }[];
    attestation?: Attestation;
  };
};

export type StudioViewsMetrics = ViewsMetrics['metrics'];
