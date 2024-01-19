import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { StoreApi, createStore } from "zustand/vanilla";

import { ClientStorage } from "../storage";
import { getPlaybackIdFromSourceUrl } from "./metrics/utils";
import { ImageSrc, Src, getMediaSourceType } from "./src";

import { omit } from "../utils";
import {
  isAccessControlError,
  isBframesError,
  isNotAcceptableError,
  isStreamOfflineError,
} from "../errors";

const DEFAULT_SEEK_TIME = 5000; // milliseconds which the media will skip when seeking with arrows/buttons
export const DEFAULT_VOLUME_LEVEL = 1; // 0-1 for how loud the audio is

export const DEFAULT_AUTOHIDE_TIME = 3000; // milliseconds to wait before hiding controls

export type DeviceInformation = {
  version: string;
  isMobile: boolean;
  isIos: boolean;
  isAndroid: boolean;
  userAgent: string;

  /** If the media supports changing the volume */
  isVolumeChangeSupported: boolean;
  /** If the media supports PiP */
  isPictureInPictureSupported: boolean;
  /** If the media supports fullscreen */
  isFullscreenSupported: boolean;

  /** If the media supports HLS playback */
  isHlsSupported: boolean;
  /** If the media supports WebRTC */
  isWebRTCSupported: boolean;
};

export type ControlsState = {
  /** The last time that play/pause was requested */
  requestedPlayPauseLastTime: number;
  /** The last time that fullscreen was changed */
  requestedFullscreenLastTime: number;
  /** The last time that picture in picture was changed */
  requestedPictureInPictureLastTime: number;
  /** Internal value when a user requests an update to the progress of the media */
  requestedRangeToSeekTo: number;

  /** The last time that a play event was received */
  playLastTime: number;
  /** The offset of the browser's livestream versus the server time (in ms). */
  playbackOffsetMs: number | null;
  /** The last time that the media was interacted with */
  lastInteraction: number;
  /** The parsed playbackId from the src */
  playbackId: string | null;
  /** The last time that an error occurred */
  lastError: number;

  /** Media sizing information */
  size: MediaSizing | null;

  /** If the volume is muted */
  muted: boolean;
  /** The volume, doesn't change when muted */
  volume: number;

  /** Session token for the current playback */
  sessionToken: string;
};

export type ObjectFit = "cover" | "contain";

/**
 * Type representing the different playback states of a video.
 */
export type PlaybackState =
  /** State when the video is currently playing. Corresponds to 'playing' event. */
  | "playing"
  /** State when the video is paused. Corresponds to 'pause' event. */
  | "paused"
  /** State when the video is loading. Corresponds to 'loadstart' event. */
  | "loading"
  /** State when the video can be played, but might not play through completely. Corresponds to 'canplay' event. */
  | "canPlay"
  /** State when the video is buffering. Corresponds to 'waiting' event. */
  | "buffering"
  /** State when the video playback has ended. Corresponds to 'ended' event. */
  | "ended"
  /** State when the video playback is stalled. Corresponds to 'stalled' event. */
  | "stalled"
  /** State when there is an error in video playback. Corresponds to 'error' event. */
  | "error";

export type InitialProps = {
  /** If autoPlay was passed in to the Player */
  autoPlay: boolean;
  /** The preload option passed in to the Player */
  preload: "auto" | "metadata" | "none";
  /** The viewerId for the viewer passed in to Player */
  viewerId: string | null;
  /** The creatorId for the broadcast component */
  creatorId: string | null;

  /** The volume that was passed in to the Player */
  volume: number;
  /** The playback rate that was passed in to the Player. Defaults to 1. */
  playbackRate: number;
  /** Whether the media should loop on completion. */
  loop: boolean;
  /**
   * Whether low latency is enabled for live-streaming.
   * `force` can be passed to force the use of WebRTC low latency playback,
   * and disable fallback to HLS if WebRTC cannot be used.
   * Defaults to `true`.
   */
  lowLatency: boolean | "force";
  /** The JWT which is passed along to allow playback of an asset. */
  jwt: string | null;
  /** An access key to be used for playback. */
  accessKey: string | null;
  /** Callback called when there is a playback error. When `null` is passed, the error has been resolved. */
  onError: ((error: PlaybackError | null) => void) | null;
};

export type PlaybackError = {
  type: "offline" | "access-control" | "fallback" | "unknown";
  message: string;
};

export type MediaSizing = {
  container?: ElementSize;
  media?: ElementSize;
};

export type ElementSize = {
  width: number;
  height: number;
};

export type Metadata = {
  bframes?: number;
  bufferWindow?: number;
};

export type ClipLength = 90 | 60 | 45 | 30 | 15 | 10;

const omittedKeys = [
  "__initialProps",
  "__device",
  "__controls",
  "__metadata",
  "__controlsFunctions",
] as const;

export const sanitizeMediaControllerState = (
  state: MediaControllerState,
): MediaControllerCallbackState => omit(state, ...omittedKeys);

export type MediaControllerCallbackState = Omit<
  MediaControllerState,
  (typeof omittedKeys)[number]
>;

const generateRandomToken = () => {
  try {
    return Math.random().toString(16).substring(2);
  } catch (e) {
    //
  }

  return "none";
};

export type MediaControllerState = {
  /** Current volume of the media. 0 if it is muted. */
  volume: number;
  /** The current playback rate for the media. Defaults to 1. */
  playbackRate: number;
  /** Current progress of the media (in seconds) */
  progress: number;
  /** Current total duration of the media (in seconds) */
  duration: number;
  /** Current buffered end time for the media (in seconds) */
  buffered: number;

  /** The audio and video device IDs currently used (only applies to broadcasting) */
  deviceIds: {
    audio?: string;
    video?: string;
  } | null;
  /** If video is enabled (only applies to broadcasting) */
  video: boolean | null;

  /** The thumbnail URL for the media. */
  thumbnail: ImageSrc | null;
  /** If the media is fullscreen. */
  fullscreen: boolean;
  /** If the media is in picture in picture mode */
  pictureInPicture: boolean;

  /** The playback state of the media. */
  playbackState: PlaybackState;
  /** If the media has experienced an error. */
  error: PlaybackError | null;
  /** The number of errors that have occurred. */
  errorCount: number;

  /** If all controls are currently hidden */
  hidden: boolean;
  /** If the content is live media */
  live: boolean;

  /** If the media has been played yet. */
  hasPlayed: boolean;

  /** The ingest URL that was passed in to the Broadcast */
  inputIngest: string | null;
  /** The sorted sources that were passed in to the Player */
  sortedSources: Src[] | string | null;
  /** The current source that is playing. */
  currentSource: Src | null;
  /** The final playback URL for the media that is playing, after redirects. */
  currentUrl: string | null;

  /** The initial props passed into the component. */
  __initialProps: InitialProps;
  /** The device information and support. */
  __device: DeviceInformation;
  /** The controls state. */
  __controls: ControlsState;
  /** The media metadata, from the playback websocket */
  __metadata: Metadata | null;

  /** Internal element used for playing media */
  // _element: TElement | null;

  /** Internal MediaStream used for broadcasting */
  // _mediaStream: TMediaStream | null;

  __controlsFunctions: {
    // updateSource: (source: Src) => void;
    // updateMediaStream: (
    //   mediaStream: TMediaStream,
    //   ids?: { audio?: string; video?: string },
    // ) => void;

    requestSeek: (time: number) => void;

    requestSeekBack: (difference?: number) => void;
    requestSeekForward: (difference?: number) => void;
    requestSeekDiff: (difference: number) => void;
    togglePlay: (force?: boolean) => void;
    toggleVideo: () => void;

    setHidden: (hidden: boolean) => void;
    updateLastInteraction: () => void;

    updatePlaybackOffsetMs: (offset: number) => void;

    setWebsocketMetadata: (metadata: Metadata) => void;

    onPlay: () => void;
    onPause: () => void;
    onCanPlay: () => void;
    onProgress: (time: number) => void;
    onDurationChange: (duration: number) => void;
    onWaiting: () => void;
    onStalled: () => void;
    onLoading: () => void;
    onEnded: () => void;

    updateBuffered: (buffered: number) => void;

    onError: (error: Error | null) => void;

    setLive: (live: boolean) => void;

    setSize: (size: Partial<MediaSizing>) => void;

    setFullscreen: (fullscreen: boolean) => void;
    setPictureInPicture: (pictureInPicture: boolean) => void;
    requestToggleFullscreen: () => void;
    requestTogglePictureInPicture: () => void;

    setVolume: (volume: number) => void;
    requestVolume: (volume: number) => void;
    requestToggleMute: () => void;

    onFinalUrl: (url: string | null) => void;
  };
};

export type MediaControllerStore = StoreApi<MediaControllerState> & {
  subscribe: {
    (
      listener: (
        selectedState: MediaControllerState,
        previousSelectedState: MediaControllerState,
      ) => void,
    ): () => void;
    <U>(
      selector: (state: MediaControllerState) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      },
    ): () => void;
  };
};

const getFilteredNaN = (value: number | undefined | null) =>
  value && !Number.isNaN(value) && Number.isFinite(value) ? value : 0;

const getBoundedSeek = (seek: number, duration: number | undefined) =>
  Math.min(
    Math.max(0, getFilteredNaN(seek)),
    // seek to near the end
    getFilteredNaN(duration) ? getFilteredNaN(duration) - 0.01 : 0,
  );

const getBoundedVolume = (volume: number) =>
  Math.min(Math.max(0, getFilteredNaN(volume)), 1);

const SCREEN_WIDTH_MULTIPLIER = 2.5;

type SrcWithParentDelta = Src & {
  parentWidthDelta: number | null;
};

const sortSources = (
  src: Src[] | string | null | undefined,
  parentWidth: number | null,
) => {
  if (!src) {
    return null;
  }

  if (typeof src === "string") {
    return [getMediaSourceType(src)];
  }

  const filteredVideoSources = src.filter((s) => s.type !== "image");

  const parentWidthWithDefault =
    (parentWidth ?? 1280) * SCREEN_WIDTH_MULTIPLIER;

  const sourceWithParentDelta: SrcWithParentDelta[] =
    filteredVideoSources?.map((s) =>
      s.type === "hls" || s.type === "webrtc"
        ? { ...s, parentWidthDelta: null }
        : {
            ...s,
            parentWidthDelta: s?.width
              ? Math.abs(parentWidthWithDefault - s.width)
              : s?.src.includes("static360p") || s?.src.includes("low-bitrate")
                ? Math.abs(parentWidthWithDefault - 480)
                : s?.src.includes("static720p")
                  ? Math.abs(parentWidthWithDefault - 1280)
                  : s?.src.includes("static1080p")
                    ? Math.abs(parentWidthWithDefault - 1920)
                    : s?.src.includes("static2160p")
                      ? Math.abs(parentWidthWithDefault - 3840)
                      : null,
          },
    ) ?? [];

  const sortedSources = sourceWithParentDelta.sort((a, b) => {
    if (a.type === "video" && b.type === "video") {
      // we sort the sources by the delta between the video width and the
      // parent size (multiplied by a multiplier above)
      return b?.parentWidthDelta && a?.parentWidthDelta
        ? a.parentWidthDelta - b.parentWidthDelta
        : 1;
    }
    if (a.type === "video" && (b.type === "hls" || b.type === "webrtc")) {
      // if the type is an MP4, we prefer that to HLS/WebRTC due to better caching/less overhead
      return -1;
    }
    if (a.type === "webrtc" && b.type === "hls") {
      // if there is a webrtc source, we prefer that to HLS
      return -1;
    }

    return 1;
  });

  return sortedSources.reverse();
};

const parseCurrentSourceAndPlaybackId = ({
  source,
  sessionToken,
  jwt,
  accessKey,
}: {
  source: Src | null;
  sessionToken: string;
  jwt: InitialProps["jwt"];
  accessKey: InitialProps["accessKey"];
}) => {
  if (!source) {
    return null;
  }

  const playbackId = getPlaybackIdFromSourceUrl(source.src);

  const url = new URL(source.src);

  // append the tkn to the query params
  if (sessionToken) {
    url.searchParams.append("tkn", sessionToken);
  }

  // we use headers for HLS and WebRTC for auth
  if (source.type !== "webrtc" && source.type !== "hls") {
    // append the JWT to the query params
    if (jwt) {
      url.searchParams.append("jwt", jwt);
    }
    // or append the access key to the query params
    else if (accessKey) {
      url.searchParams.append("accessKey", accessKey);
    }
  }

  // override the url with the new URL
  const newSrc = {
    ...source,
    src: url.toString(),
  } as Src;

  return {
    currentSource: newSrc,
    playbackId,
  } as const;
};

export const createControllerStore = ({
  device,
  storage,
  src,
  initialProps,
}: {
  device: DeviceInformation;
  storage: ClientStorage;
  src: Src[] | string;
  initialProps: Partial<InitialProps>;
}): MediaControllerStore => {
  const initialVolume = getBoundedVolume(
    initialProps.volume ?? DEFAULT_VOLUME_LEVEL,
  );

  const sessionToken = generateRandomToken();

  const thumbnailSrc =
    typeof src === "string"
      ? null
      : (src?.find?.((s) => s.type === "image") as ImageSrc | null | undefined);

  const sortedSources = sortSources(src, null);

  const parsedSource = parseCurrentSourceAndPlaybackId({
    source: sortedSources?.[0],
    jwt: initialProps.jwt,
    accessKey: initialProps.accessKey,
    sessionToken,
  });

  const initialControls: ControlsState = {
    requestedRangeToSeekTo: 0,
    requestedFullscreenLastTime: Date.now(),
    requestedPictureInPictureLastTime: Date.now(),
    requestedPlayPauseLastTime: 0,
    playLastTime: 0,
    playbackOffsetMs: null,
    lastInteraction: Date.now(),
    lastError: 0,
    playbackId: parsedSource.playbackId,
    size: null,

    volume: initialVolume,
    muted: initialVolume === 0,
    sessionToken,
  };

  const store = createStore<
    MediaControllerState,
    [
      ["zustand/subscribeWithSelector", Partial<MediaControllerState>],
      ["zustand/persist", Partial<MediaControllerState>],
    ]
  >(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          currentSource: parsedSource.currentSource,

          canPlay: false,
          hidden: false,
          /** Current volume of the media. 0 if it is muted. */
          volume: initialVolume,
          /** The playback rate for the media. Defaults to 1. */
          playbackRate: 1,
          /** Current progress of the media (in seconds) */
          progress: 0,
          /** Current total duration of the media (in seconds) */
          duration: 0,
          /** Current buffered end time for the media (in seconds) */
          buffered: 0,

          thumbnail: thumbnailSrc ?? null,

          /** The audio and video device IDs currently used (only applies to broadcasting) */
          deviceIds: null,
          /** If video is enabled (only applies to broadcasting) */
          video: null,

          /** If the media is fullscreen. */
          fullscreen: false,
          /** If the media is in picture in picture mode */
          pictureInPicture: false,

          /** The playback state of the media. */
          playbackState: "loading",
          /** If the media has experienced an error. */
          error: null,
          errorCount: 0,

          /** If the content is live media */
          live: false,

          /** If the media has been played yet. */
          hasPlayed: false,

          /** The ingest URL that was passed in to the Broadcast */
          inputIngest: null,
          /** The sorted sources that were passed in to the Player */
          sortedSources: sortedSources ?? null,

          /** The final playback URL for the media that is playing, after redirects. */
          currentUrl: null,

          __initialProps: {
            volume: initialVolume ?? null,
            playbackRate: initialProps.playbackRate ?? 1,
            loop: initialProps.loop ?? false,

            autoPlay: initialProps.autoPlay ?? false,
            creatorId: initialProps.creatorId ?? null,
            preload: initialProps.preload ?? "none",
            viewerId: initialProps.viewerId ?? null,
            lowLatency: initialProps.lowLatency ?? true,

            jwt: initialProps.jwt ?? null,
            accessKey: initialProps.accessKey ?? null,
            onError: initialProps?.onError ?? null,
          },

          __device: device,

          __controls: initialControls,

          __metadata: null,

          __controlsFunctions: {
            // updateMediaStream: (_mediaStream, ids) =>
            //   set(({ deviceIds }) => ({
            //     _mediaStream,
            //     ...(ids?.video ? { video: true } : {}),
            //     deviceIds: {
            //       ...deviceIds,
            //       ...(ids?.audio ? { audio: ids.audio } : {}),
            //       ...(ids?.video ? { video: ids.video } : {}),
            //     },
            //   })),

            setHidden: (hidden: boolean) =>
              set(({ playbackState }) => ({
                hidden: playbackState === "playing" ? hidden : false,
              })),
            updateLastInteraction: () =>
              set(() => ({ _lastInteraction: Date.now(), hidden: false })),

            // set the src and playbackId from the source URL
            // updateSource: (source: Src) =>
            //   set(({ __controls, __device, __initialProps }) =>
            //     parseCurrentSource({
            //       source,
            //       controls: __controls,
            //       device: __device,
            //       initialProps: __initialProps,
            //     }),
            //   ),

            updatePlaybackOffsetMs: (offset: number) =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  playbackOffsetMs: offset,
                },
              })),

            onCanPlay: () =>
              set(() => ({
                playbackState: "canPlay",
              })),

            onPlay: () =>
              set(({ __controls, __controlsFunctions }) => {
                __controlsFunctions.onError(null);

                return {
                  playbackState: "playing",
                  hasPlayed: true,
                  error: null,
                  __controls: {
                    ...__controls,
                    playLastTime: Date.now(),
                  },
                };
              }),
            onPause: () =>
              set(() => ({
                playbackState: "paused",
              })),
            togglePlay: (force?: boolean) => {
              const { hidden, __device, __controlsFunctions } =
                store.getState();
              if (!force && hidden && __device.isMobile) {
                __controlsFunctions.setHidden(false);
              } else {
                set(({ __controls }) => ({
                  __controls: {
                    ...__controls,
                    requestedPlayPauseLastTime: Date.now(),
                    lastInteraction: Date.now(),
                  },
                }));
              }
            },
            toggleVideo: () =>
              set(({ video }) => ({
                video: !video,
              })),
            onProgress: (time) =>
              set(() => {
                return {
                  progress: getFilteredNaN(time),
                };
              }),
            requestSeek: (time) =>
              set(({ duration, __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedRangeToSeekTo: getBoundedSeek(time, duration),
                },
                progress: getBoundedSeek(time, duration),
              })),

            onDurationChange: (duration) =>
              set(({ live }) => ({
                duration,
                live: duration === Number.POSITIVE_INFINITY ? true : live,
              })),

            setWebsocketMetadata: (metadata: Metadata) =>
              set(() => ({ __metadata: metadata })),

            onError: (rawError: Error | null) =>
              set(
                ({
                  currentSource,
                  sortedSources,
                  __controls,
                  errorCount,
                  __device,
                  __initialProps,
                }) => {
                  const msSinceLastError = Date.now() - __controls.lastError;

                  const error = rawError
                    ? ({
                        type: isAccessControlError(rawError)
                          ? "access-control"
                          : isBframesError(rawError) ||
                              isNotAcceptableError(rawError)
                            ? "fallback"
                            : isStreamOfflineError(rawError)
                              ? "offline"
                              : "unknown",
                        message: rawError?.message ?? "Error with playback.",
                      } as const)
                    : null;

                  if (__initialProps.onError) {
                    try {
                      __initialProps.onError(error);
                    } catch (e) {
                      console.error(e);
                    }
                  }

                  const base = {
                    error,
                    ...(error
                      ? ({
                          errorCount: errorCount + 1,
                          playbackState: "error",
                          __controls: {
                            ...__controls,
                            lastError: Date.now(),
                          },
                        } as const)
                      : { __controls }),
                  } as const;

                  // we return when there is no error
                  if (!error) {
                    return base;
                  }

                  console.error(error);

                  // we increment the source only on a bframes or unknown error
                  if (
                    error.type === "offline" ||
                    error.type === "access-control"
                  ) {
                    return base;
                  }

                  if (
                    typeof sortedSources === "string" ||
                    !Array.isArray(sortedSources)
                  ) {
                    return base;
                  }

                  // we debounce the error fallback
                  if (msSinceLastError < errorCount * 500) {
                    return base;
                  }

                  const currentSourceBaseUrl = new URL(currentSource.src);

                  // Clear the search parameters
                  currentSourceBaseUrl.search = "";

                  const currentSourceIndex = sortedSources.findIndex(
                    (s) => s.src === currentSourceBaseUrl.toString(),
                  );

                  // Create a new array that starts from the next index and wraps around
                  const rotatedSources = [
                    ...sortedSources.slice(currentSourceIndex + 1),
                    ...sortedSources.slice(0, currentSourceIndex + 1),
                  ];

                  // Function to determine if a source type can be played
                  const canPlaySourceType = (src: Src) => {
                    const hasOneWebRTCSource = sortedSources.some(
                      (s) => s?.type === "webrtc",
                    );

                    // if low latency is forced, and there is at least one webrtc source, don't play non-webrtc
                    if (
                      __initialProps.lowLatency === "force" &&
                      hasOneWebRTCSource &&
                      src.type !== "webrtc"
                    ) {
                      return false;
                    }

                    // if low latency is turned off, do not play webrtc
                    if (__initialProps.lowLatency === false) {
                      return src.type !== "webrtc";
                    }

                    // else play if webrtc is supported
                    return src.type === "webrtc"
                      ? __device.isWebRTCSupported
                      : true;
                  };

                  // Find the next index in the rotated array where the source can be played
                  const nextPlayableIndex = rotatedSources.findIndex((s) =>
                    canPlaySourceType(s),
                  );

                  // Adjust the index to account for the rotation
                  const nextSourceIndex =
                    nextPlayableIndex !== -1
                      ? (currentSourceIndex + 1 + nextPlayableIndex) %
                        sortedSources.length
                      : -1;

                  // get the next source
                  const nextSource =
                    nextSourceIndex !== -1
                      ? sortedSources[nextSourceIndex]
                      : null;

                  const parsedSourceNew = parseCurrentSourceAndPlaybackId({
                    source: nextSource,
                    jwt: __initialProps.jwt,
                    accessKey: __initialProps.accessKey,
                    sessionToken: __controls.sessionToken,
                  });

                  return {
                    ...base,
                    currentSource: parsedSourceNew.currentSource,
                    __controls: {
                      ...base.__controls,
                      playbackId: parsedSourceNew.playbackId,
                    },
                  };
                },
              ),

            updateBuffered: (buffered) => set(() => ({ buffered })),

            requestSeekDiff: (difference) =>
              set(({ progress, duration, __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedRangeToSeekTo: getBoundedSeek(
                    getFilteredNaN(progress) + difference / 1000,
                    duration,
                  ),
                },
              })),
            requestSeekBack: (difference = DEFAULT_SEEK_TIME) =>
              get().__controlsFunctions.requestSeekDiff(-difference),
            requestSeekForward: (difference = DEFAULT_SEEK_TIME) =>
              get().__controlsFunctions.requestSeekDiff(difference),

            onFinalUrl: (currentUrl: string | null) =>
              set(() => ({ currentUrl })),

            setSize: (size: Partial<MediaSizing>) =>
              set(({ __controls, __device, __initialProps }) => {
                // we re-sort the sources based on the container width
                // const newSortedSources = size?.container?.width
                //   ? sortSources(src, size.container.width)
                //   : null;

                // // and set a new source from the new sort
                // const newSource = newSortedSources
                //   ? newSortedSources?.[0] ?? null
                //   : null;

                const base = {
                  __controls: {
                    ...__controls,
                    size: {
                      ...__controls.size,
                      size,
                    },
                  },
                } as const;

                // console.log("setsize is setting next source" + newSource);

                return {
                  ...base,
                };
              }),
            onWaiting: () => set(() => ({ playbackState: "buffering" })),

            onStalled: () => set(() => ({ playbackState: "stalled" })),
            onLoading: () => set(() => ({ playbackState: "loading" })),
            onEnded: () => set(() => ({ playbackState: "ended" })),

            setFullscreen: (fullscreen: boolean) => set(() => ({ fullscreen })),
            requestToggleFullscreen: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedFullscreenLastTime: Date.now(),
                },
              })),

            setPictureInPicture: (pictureInPicture: boolean) =>
              set(() => ({ pictureInPicture })),
            requestTogglePictureInPicture: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedPictureInPictureLastTime: Date.now(),
                },
              })),

            setLive: (live: boolean) => set(() => ({ live })),

            requestVolume: (newVolume) =>
              set(({ __controls }) => ({
                volume: getBoundedVolume(newVolume),
                __controls: {
                  ...__controls,
                  volume:
                    newVolume === 0 ? newVolume : getBoundedVolume(newVolume),
                  muted: newVolume === 0,
                },
              })),
            setVolume: (newVolume) =>
              set(({ __controls }) => ({
                volume: getBoundedVolume(newVolume),
                __controls: {
                  ...__controls,
                  volume: getBoundedVolume(newVolume),
                },
              })),

            requestToggleMute: () =>
              set(({ volume, __controls }) => ({
                volume: volume !== 0 ? 0 : __controls.volume,
                __controls: {
                  ...__controls,
                  muted: !__controls.muted,
                },
              })),
          },
        }),
        {
          name: "livepeer-player-controller",
          version: 2,
          // since these values are persisted across media, only persist volume and playbackRate
          partialize: ({ volume, playbackRate }) => ({
            volume,
            playbackRate,
          }),
          storage: createJSONStorage(() => storage),
        },
      ),
    ),
  );

  return store;
};

export type ControlsOptions = {
  /** Auto-hide controls after a set amount of time (in milliseconds). Defaults to 3000. Set to 0 for no hiding. */
  autohide?: number;
  /** Sets the default volume. Must be between 0 and 1. */
  defaultVolume?: number;
};
