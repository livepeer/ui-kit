import {
  Asset,
  CreateStreamArgs,
  MultistreamTargetRef,
  Stream,
  StreamSession,
  TranscodingProfile,
} from '../../types';

/**
 * Studio ffmpeg profile for transcoding.
 */
export type StudioFfmpegProfile = TranscodingProfile & {
  /** Size of the GOP (group of pictures) to generate in output */
  gop?: string;
  /** Codec for output porifle. Defaults to h264 */
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

export type StudioAssetPatchPayload = {
  /**
   * Name of the asset. This is not necessarily the filename, can be a custom name or title
   */
  name?: string;
  /**
   * User input metadata associated with the asset
   */
  meta?: {
    [k: string]: string;
  };
  storage?: {
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

export interface StudioAsset extends Asset {
  storage?: {
    status: NonNullable<Asset['storage']>['status'];
    ipfs?: NonNullable<Asset['storage']>['ipfs'] & {
      spec?: {
        /**
         * Name of the NFT metadata template to export. 'player' will embed the
         * Livepeer Player on the NFT while 'file' will reference only the
         * immutable MP4 files.
         */
        nftMetadataTemplate?: 'player' | 'file';
        /**
         * Additional data to add to the NFT metadata exported to IPFS. Will be
         * deep merged with the default metadata exported.
         */
        nftMetadata?: {
          [k: string]: unknown;
        };
      };
      nftMetadata?: {
        /** CID of the file on IPFS */
        cid?: string;
        /** URL with IPFS scheme for the file */
        url?: string;
        /** URL to access file via HTTP through an IPFS gateway */
        gatewayUrl?: string;
      };
    };
  };
}

// TODO: create a description of the fields
// Type copied from https://github.com/livepeer/player/blob/be5eebb47efdaa997ee4dcce818dc72cbf7ff627/src/index.ts#L27
export type StudioPlaybackInfo = {
  type: string;
  meta: {
    live?: 0 | 1;
    source: {
      hrn: string;
      type: string;
      url: string;
    }[];
  };
};
