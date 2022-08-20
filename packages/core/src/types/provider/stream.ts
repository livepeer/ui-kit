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

export type GetStreamSessionArgs = StreamSessionIdOrString;
export type GetStreamSessionsArgs = StreamIdOrString;

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

export type TranscodingProfile = {
  name: string;
  bitrate: number;
  fps: number;
  width: number;
  height: number;
};
