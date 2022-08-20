import { ReadStream } from 'fs';

export type AssetIdOrString =
  | string
  | {
      assetId: string;
    };

export type CreateAssetProgressUpdate = {
  progress: number;
  complete: boolean;
};

export type CreateAssetArgs = {
  name: string;
  file: File | ReadStream;
};

export type UpdateAssetArgs = {
  /** The unique identifier for the asset */
  assetId: string;
  /** The name of the asset */
  name?: string;
  /** Enable asset storage to be replicated to IPFS */
  storage?: 'ipfs' | null;
  /** Metadata associated with the asset */
  meta?: Record<string, string>;
} & (
  | {
      name: string;
    }
  | {
      storage: 'ipfs' | null;
    }
  | {
      meta: Record<string, string>;
    }
);

export type GetAssetArgs = AssetIdOrString;

export type Asset = {
  id: string;
  /**
   * Type of the asset.
   */
  type?: 'video' | 'audio';
  /**
   * Used to form playback URL and storage folder
   */
  playbackId?: string;
  /**
   * Used to form recording URL for HLS playback
   */
  playbackRecordingId?: string;
  /**
   * URL for HLS playback
   */
  playbackUrl?: string;
  /**
   * URL to manually download the asset if desired
   */
  downloadUrl?: string;
  /**
   * owner of the asset
   */
  userId?: string;
  /**
   * Set to true when the asset is deleted
   */
  deleted?: boolean;
  /**
   * Object store ID where the asset is stored
   */
  objectStoreId?: string;
  storage?: {
    ipfs?: {
      spec?: {
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
      nftMetadata?: Ipfs;
      /**
       * CID of the file on IPFS
       */
      cid?: string;
      /**
       * URL with IPFS scheme for the file
       */
      url?: string;
      /**
       * URL to access file via HTTP through an IPFS gateway
       */
      gatewayUrl?: string;
    };
    status?: {
      /**
       * Phase of the asset storage
       */
      phase: 'waiting' | 'ready' | 'failed' | 'reverted';
      /**
       * Error message if the last storage changed failed.
       */
      errorMessage?: string;
      tasks: {
        /**
         * ID of any currently running task that is exporting this asset to IPFS.
         */
        pending?: string;
        /**
         * ID of the last task to run successfully, that created the currently saved data.
         */
        last?: string;
        /**
         * ID of the last task to fail execution.
         */
        failed?: string;
      };
    };
  };
  /**
   * Status of the asset
   */
  status?: {
    /**
     * Phase of the asset
     */
    phase: 'waiting' | 'ready' | 'failed';
    /**
     * Timestamp (in milliseconds) at which the asset was last updated
     */
    updatedAt: number;
    /**
     * Error message if the asset creation failed.
     */
    errorMessage?: string;
  };
  /**
   * Name of the asset. This is not necessarily the filename, can be a custom name or title
   */
  name: string;
  /**
   * User input metadata associated with the asset
   */
  meta?: {
    [k: string]: string;
  };
  /**
   * Timestamp (in milliseconds) at which asset was created
   */
  createdAt?: number;
  /**
   * Size of the asset in bytes
   */
  size?: number;
  /**
   * Hash of the asset
   */
  hash?: {
    /**
     * Hash of the asset
     */
    hash?: string;
    /**
     * Hash algorithm used to compute the hash
     */
    algorithm?: string;
  }[];
  /**
   * Video metadata
   */
  videoSpec?: {
    /**
     * Format of the asset
     */
    format?: string;
    /**
     * Duration of the asset in seconds (float)
     */
    duration?: number;
    /**
     * Bitrate of the video in bits per second
     */
    bitrate?: number;
    /**
     * List of tracks associated with the asset when the format contemplates them (e.g. mp4)
     */
    tracks?: {
      /**
       * type of track
       */
      type: 'video' | 'audio';
      /**
       * Codec of the track
       */
      codec: string;
      /**
       * Start time of the track in seconds
       */
      startTime?: number;
      /**
       * Duration of the track in seconds
       */
      duration?: number;
      /**
       * Bitrate of the track in bits per second
       */
      bitrate?: number;
      /**
       * Width of the track - only for video tracks
       */
      width?: number;
      /**
       * Height of the track - only for video tracks
       */
      height?: number;
      /**
       * Pixel format of the track - only for video tracks
       */
      pixelFormat?: string;
      /**
       * Frame rate of the track - only for video tracks
       */
      fps?: number;
      /**
       * Amount of audio channels in the track
       */
      channels?: number;
      /**
       * Sample rate of the track in samples per second - only for audio tracks
       */
      sampleRate?: number;
      /**
       * Bit depth of the track - only for audio tracks
       */
      bitDepth?: number;
    }[];
  };
  /**
   * ID of the source asset (root) - If missing, this is a root asset
   */
  sourceAssetId?: string;
};

export type Ipfs = {
  /**
   * CID of the file on IPFS
   */
  cid: string;
  /**
   * URL with IPFS scheme for the file
   */
  url?: string;
  /**
   * URL to access file via HTTP through an IPFS gateway
   */
  gatewayUrl?: string;
};
