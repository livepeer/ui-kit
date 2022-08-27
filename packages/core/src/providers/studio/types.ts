import {
  Asset,
  CreateAssetArgs,
  CreateStreamArgs,
  Stream,
  StreamSession,
  TranscodingProfile,
  UpdateAssetArgs,
  UpdateStreamArgs,
} from '../../types';

/**
 * Studio ffmpeg profile for transcoding.
 */
export type StudioFfmpegProfile = TranscodingProfile & {
  fps: number;
  gop?: string;
  profile?: 'H264Baseline' | 'H264Main' | 'H264High' | 'H264ConstrainedHigh';
  encoder?: 'h264' | 'hevc' | 'vp8' | 'vp9';
};

export interface StudioStream extends Stream {
  profiles: StudioFfmpegProfile[];
  /**
   * Name of the token used to create this object.
   */
  createdByTokenName?: string;
  /** Configuration for multistreaming (AKA restream, simulcast) */
  multistream?: {
    /**
     * References to targets where this stream will be simultaneously streamed to
     */
    targets?: MultistreamTarget[];
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
  /** Configuration for multistreaming (AKA restream, simulcast) */
  multistream?: {
    /**
     * References to targets where this stream will be simultaneously streamed to
     */
    targets?: MultistreamTarget[];
  };
}

export type StudioUpdateStreamArgs =
  | UpdateStreamArgs & {
      /** Configuration for multistreaming (AKA restream, simulcast) */
      multistream?: {
        /**
         * References to targets where this stream will be simultaneously streamed to
         */
        targets?: MultistreamTarget[];
      };
    };

export type MultistreamTarget = {
  /**
   * Name of transcoding profile that should be sent. Use "source" for pushing
   * source stream data
   */
  profile: string;
  /**
   * If true, the stream audio will be muted and only silent video will be
   * pushed to the target.
   */
  videoOnly?: boolean;
  /**
   * ID of multistream target object where to push this stream
   */
  id?: string;
  /**
   * Inline multistream target object. Will automatically create the target
   * resource to be used by the created stream.
   */
  spec?: {
    /** Name for the multistream target */
    name?: string;
    /**
     * Livepeer-compatible multistream target URL (RTMP(s) or SRT)
     */
    url: string;
  };
};

export interface StudioStreamSession extends StreamSession {
  profiles: StudioFfmpegProfile[];
  /**
   * Name of the token used to create this object.
   */
  createdByTokenName?: string;
  /** Configuration for multistreaming (AKA restream, simulcast) */
  multistream?: {
    /**
     * References to targets where this stream will be simultaneously streamed to
     */
    targets?: MultistreamTarget[];
  };
}

export type StudioError = {
  errors: [string, ...string[]];
};

export type TaskIdOrString =
  | string
  | {
      /** The unique identifier for the task */
      taskId: string;
    };

export type GetTaskArgs = TaskIdOrString;

export type WaitTaskArgs = TaskIdOrString & {
  onProgress?: (task: StudioTask) => void;
};

export type StudioTask = {
  /** Task ID */
  id: string;
  /** Type of the task */
  type: 'import' | 'export' | 'transcode';
  /** Timestamp (in milliseconds) at which task was created */
  createdAt: number;
  /** ID of the input asset */
  inputAssetId?: string;
  /** ID of the output asset */
  outputAssetId?: string;
  /** Parameters of the task */
  params: Record<NonNullable<StudioTask['type']>, any>;
  /** Output of the task */
  output: Record<NonNullable<StudioTask['type']>, any>;
  /** Status of the task */
  status: {
    /** High-level descriptor of where the task is in its lifecycle. */
    phase:
      | 'pending'
      | 'waiting'
      | 'running'
      | 'failed'
      | 'completed'
      | 'cancelled';
    /** Timestamp (in milliseconds) at which task was last updated */
    updatedAt: number;
    /** Current progress of the task in a 0-1 completion ratio */
    progress?: number;
    /** Error message if the task failed */
    errorMessage?: string;
  };
};

export interface StudioCreateAssetArgs extends CreateAssetArgs {
  /**
   * Callback to receive progress (0-1 completion ratio) updates of the upload.
   */
  onUploadProgress?: (progress: number) => void;
  /**
   * Whether to wait until the asset is ready before returning. Can provide
   * onProgress function to get intermediate updates about the process.
   */
  waitReady?: boolean | Pick<WaitTaskArgs, 'onProgress'>;
}

export type StudioUpdateAssetArgs = UpdateAssetArgs & {
  /**
   * Whether to wait until the asset storage is ready before returning. Can
   * provide onProgress function to get intermediate updates about the process.
   */
  waitStorageReady?: boolean | Pick<WaitTaskArgs, 'onProgress'>;
};

export interface StudioAsset extends Asset {
  storage?: {
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
    status?: NonNullable<Asset['storage']>['status'] & {
      tasks: {
        /**
         * ID of any currently running task that is exporting this asset to IPFS
         */
        pending?: string;
        /**
         * ID of the last task to run successfully, that created the currently
         * saved data
         */
        last?: string;
        /**  ID of the last task to fail execution */
        failed?: string;
      };
    };
  };
}
