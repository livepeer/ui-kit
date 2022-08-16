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

export type StreamIdOrString =
  | string
  | {
      streamId: string;
    };

export type StreamSessionIdOrString =
  | string
  | {
      streamSessionId: string;
    };

export type CreateStreamArgs = {
  name: string;
  profiles?: TranscodingProfile[];
};

export type UpdateStreamArgs = {
  /** The unique identifier for the stream */
  streamId: string;
  /** Boolean indicator to suspend the stream */
  suspend?: boolean;
  /** Boolean indicator to record the stream */
  record?: boolean;
} & (
  | {
      suspend: boolean;
    }
  | {
      record: boolean;
    }
);

export type GetStreamArgs = StreamIdOrString;
export type GetStreamSessionsArgs = StreamIdOrString;
export type GetStreamSessionArgs = StreamSessionIdOrString;

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
  file: File;
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

export type Stream = {
  id: string;
  kind?: string;
  name: string;
  lastSeen?: number;
  sourceSegments?: number;
  transcodedSegments?: number;
  playbackUrl: string;
  /**
   * Duration of all the source segments, sec
   */
  sourceSegmentsDuration?: number;
  /**
   * Duration of all the transcoded segments, sec
   */
  transcodedSegmentsDuration?: number;
  sourceBytes?: number;
  transcodedBytes?: number;
  /**
   * Rate at which sourceBytes increases (bytes/second)
   */
  ingestRate?: number;
  /**
   * Rate at which transcodedBytes increases (bytes/second)
   */
  outgoingRate?: number;
  /**
   * Set to true when stream deleted
   */
  deleted?: boolean;
  /**
   * If currently active
   */
  isActive?: boolean;
  /**
   * Name of the token used to create this object
   */
  createdByTokenName?: string;
  createdByTokenId?: string;
  /**
   * Timestamp (in milliseconds) at which stream object was created
   */
  createdAt?: number;
  /**
   * Points to parent stream object
   */
  parentId?: string;
  /**
   * Indicates that this is not final object of `user's` session
   */
  partialSession?: boolean;
  /**
   * Ids of the previous sessions which are part of `user's` session
   */
  previousSessions?: string[];
  /**
   * Used to form RTMP ingest URL
   */
  streamKey?: string;
  /**
   * URL for HLS ingest
   */
  ingestUrl: string;
  /**
   * Used to form playback URL
   */
  playbackId?: string;
  profiles?: TranscodingProfile[];
  objectStoreId?: string;
  presets?: (
    | 'P720p60fps16x9'
    | 'P720p30fps16x9'
    | 'P720p30fps4x3'
    | 'P576p30fps16x9'
    | 'P360p30fps16x9'
    | 'P360p30fps4x3'
    | 'P240p30fps16x9'
    | 'P240p30fps4x3'
    | 'P144p30fps16x9'
  )[];
  /**
   * Should this stream be recorded? Uses default settings. For more customization, create and configure an object store.
   */
  record?: boolean;
  /**
   * ID of object store where to which this stream was recorded
   */
  recordObjectStoreId?: string;
  multistream?: {
    /**
     * References to targets where this stream will be simultaneously streamed to
     */
    targets?: MultistreamTarget[];
  };
};

export type MultistreamTarget = {
  /**
   * Name of transcoding profile that should be sent. Use "source" for pushing source stream data
   */
  profile: string;
  /**
   * If true, the stream audio will be muted and only silent video will be pushed to the target.
   */
  videoOnly?: boolean;
  /**
   * ID of multistream target object where to push this stream
   */
  id?: string;
  /**
   * Inline multistream target object. Will automatically create the target resource to be used by the created stream.
   */
  spec?: {
    name?: string;
    /**
     * Livepeer-compatible multistream target URL (RTMP(s) or SRT)
     */
    url: string;
  };
};

export type StreamSession = {
  id: string;
  kind?: string;
  name: string;
  lastSeen?: number;
  sourceSegments?: number;
  transcodedSegments?: number;
  playbackUrl: string;
  /**
   * Duration of all the source segments, sec
   */
  sourceSegmentsDuration?: number;
  /**
   * Duration of all the transcoded segments, sec
   */
  transcodedSegmentsDuration?: number;
  sourceBytes?: number;
  transcodedBytes?: number;
  /**
   * Rate at which sourceBytes increases (bytes/second)
   */
  ingestRate?: number;
  /**
   * Rate at which transcodedBytes increases (bytes/second)
   */
  outgoingRate?: number;
  /**
   * Set to true when stream deleted
   */
  deleted?: boolean;
  /**
   * Timestamp (in milliseconds) at which stream object was created
   */
  createdAt?: number;
  /**
   * Points to parent stream object
   */
  parentId?: string;
  /**
   * Should this stream be recorded? Uses default settings. For more customization, create and configure an object store.
   */
  record?: boolean;
  /**
   * Status of the recording process of this stream session.
   */
  recordingStatus?: 'waiting' | 'ready';
  /**
   * URL for accessing the recording of this stream session.
   */
  recordingUrl?: string;
  /**
   * URL for the stream session recording packaged in an mp4.
   */
  mp4Url?: string;
  /**
   * ID of object store where to which this stream was recorded
   */
  recordObjectStoreId?: string;
  /**
   * Used to form playback URL
   */
  playbackId?: string;
  profiles?: TranscodingProfile[];
  lastSessionId?: string;
};

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

export type TranscodingProfile = {
  name: string;
  bitrate: number;
  fps: number;
  width: number;
  height: number;
};
