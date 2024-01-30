import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { StoreApi, createStore } from "zustand/vanilla";

import { ClientStorage, createStorage, noopStorage } from "../storage";
import { ImageSrc, Src, VideoQuality } from "./src";

import {
  isAccessControlError,
  isBframesError,
  isNotAcceptableError,
  isStreamOfflineError,
} from "../errors";
import { omit } from "../utils";
import {
  generateRandomToken,
  getBoundedRate,
  getBoundedSeek,
  getBoundedVolume,
  getClipParams,
  getFilteredNaN,
  getProgressAria,
  parseCurrentSourceAndPlaybackId,
  sortSources,
} from "./utils";

const DEFAULT_SEEK_TIME = 5000; // milliseconds which the media will skip when seeking with arrows/buttons
export const DEFAULT_VOLUME_LEVEL = 1; // 0-1 for how loud the audio is

export const DEFAULT_AUTOHIDE_TIME = 3000; // milliseconds to wait before hiding controls

export type InitialProps = {
  /**
   * An access key to be used for playback. This key grants permission to play access key protected media.
   */
  accessKey: string | null;

  /** The aspect ratio for the container element. Defines the width to height ratio of the player, like 16:9 or 4:3. */
  aspectRatio: number | null;

  /**
   * If `autoPlay` was passed in to the Player. Determines if the media should attempt to start playing automatically on load.
   *
   * Autoplay for videos in modern browsers typically works only if the video is muted or if the user has previously interacted with the website.
   *
   * @link https://developer.chrome.com/blog/autoplay/
   */
  autoPlay: boolean;

  /**
   * The length of the clip. This is usually used alongside `ClipTrigger`. Specifies the duration of the media clip, in seconds.
   *
   * Set to `null` to disable the ClipTrigger.
   */
  clipLength: ClipLength | null;

  /**
   * Whether hotkeys are enabled. Defaults to `true`. Allows users to use keyboard shortcuts for player control.
   *
   * This is highly recommended to adhere to ARIA guidelines.
   */
  hotkeys: boolean;

  /**
   * The JWT (JSON Web Token) which is passed along to allow playback of an asset. Used for authentication and information exchange.
   */
  jwt: string | null;

  /**
   * Whether low latency is enabled for live-streaming. `force` can be used to require low latency playback using WebRTC, with no fallback to HLS. Defaults to `true`,
   * which means that WebRTC is enabled by default, with fallback to HLS.
   */
  lowLatency: boolean | "force";

  /**
   * Callback called when there is an error. When `null` is passed, it indicates that the error has been resolved.
   */
  onError: ((error: PlaybackError | null) => void) | null;

  /**
   * The default playback rate for the media. Determines the speed at which the media is played, e.g., 0.5 for half-speed, 2 for double speed.
   *
   * This can be overridden during playback by the user with `RateSelect`.
   *
   * `constant` means the speed of live stream playback will remain consistent, instead of speeding up to catch up with the head of the stream.
   */
  playbackRate: PlaybackRate;

  /**
   * Controls how often the poster image updates when playing back a livestream, in ms. Set to `0` to disable. Defaults to 30s.
   */
  posterLiveUpdate: number;

  /**
   * The preload option passed in to the Player. Specifies how the media should be preloaded: 'auto', 'metadata', or 'none'.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
   */
  preload: "auto" | "metadata" | "none";

  /**
   * The timeout for playback before falling back to the next source. This includes SDP negotiation for WebRTC, waiting for WebRTC to play,
   * and responses from the server.
   *
   * In milliseconds - defaults to 10000.
   */
  timeout: number;

  /**
   * The storage option for saving persistent state, like volume and video quality.
   *
   * Defaults to `localStorage` in the browser. Pass `null` to disable storage.
   */
  storage: ClientStorage | null;

  /**
   * The default video quality for playback.
   *
   * This is overridden when a user changes it, and their preferences are, by default, saved to storage.
   */
  videoQuality: VideoQuality;

  /**
   * The default volume level of the media, ranging from 0 (muted) to 1 (maximum volume).
   *
   * This is overridden when a user changes it, and their preferences are, by default, saved to storage.
   */
  volume: number;

  /**
   * The viewerId for the viewer. A unique identifier for the user or session watching the media.
   */
  viewerId: string | null;
};

export type ControlsOptions = {
  /** Auto-hide controls after a set amount of time (in milliseconds). Defaults to 3000. Set to 0 for no hiding. */
  autohide?: number;
  /** Sets the default volume. Must be between 0 and 1. */
  defaultVolume?: number;
};

export type DeviceInformation = {
  version: string;
  isMobile: boolean;
  isIos: boolean;
  isAndroid: boolean;
  userAgent: string;
  screenWidth: number | null;

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

export type ClipParams = {
  startTime: number;
  endTime: number;
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
  /** The params for the latest clip request. */
  requestedClipParams: ClipParams | null;

  /** The parsed thumbnail URL for the media. */
  thumbnail: ImageSrc | null;

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

/**
 * The playback rate. `constant` means playing WebRTC playback at a constant pace and not speeding up.
 */
export type PlaybackRate = number | "constant";

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

export type AriaText = {
  progress: string;
  pictureInPicture: string;
  fullscreen: string;
  playPause: string;
  clip: string | null;
  time: string;
};

export type MediaControllerState = {
  /** The ARIA text for the current state */
  aria: AriaText;

  /** Current buffered end time for the media (in seconds) */
  buffered: number;
  /** Current buffered percent */
  bufferedPercent: number;

  /** If the media has loaded and can be played */
  canPlay: boolean;

  /** The current source that is playing. */
  currentSource: Src | null;
  /** The final playback URL for the media that is playing, after redirects. */
  currentUrl: string | null;

  /** Current total duration of the media (in seconds) */
  duration: number;

  /** If the media has experienced an error. */
  error: PlaybackError | null;
  /** The number of errors that have occurred. */
  errorCount: number;

  /** If the media is currently stalled */
  stalled: boolean;
  /** If the media is fullscreen. */
  fullscreen: boolean;

  /** If the media has been played yet */
  hasPlayed: boolean;

  /** If all controls are currently hidden */
  hidden: boolean;

  /** If the content is live media */
  live: boolean;

  /** If the media is currently loading */
  loading: boolean;

  /** If the video element is mounted on the DOM - this is used for initialization logic */
  mounted: boolean;

  /** The current playback rate for the media. Defaults to 1. */
  playbackRate: PlaybackRate;

  /** If the media is in picture in picture mode */
  pictureInPicture: boolean;

  /** The poster image URL for the media. */
  poster: string | null;

  /** Current progress of the media (in seconds) */
  progress: number;

  /** If the media is current playing or paused */
  playing: boolean;

  /** The sorted sources that were passed in to the Player */
  sortedSources: Src[] | string | null;

  /** Current volume of the media. 0 if it is muted. */
  volume: number;

  /** If the media is currently waiting for data */
  waiting: boolean;

  /** The quality of the video playback. */
  videoQuality: VideoQuality;

  /** If the media has ended */
  ended: boolean;

  __controls: ControlsState;
  __controlsFunctions: {
    setHidden: (hidden: boolean) => void;
    onCanPlay: () => void;
    onDurationChange: (duration: number) => void;
    onEnded: () => void;
    onError: (error: Error | null) => void;
    onFinalUrl: (url: string | null) => void;
    onLoading: () => void;
    onPause: () => void;
    onPlay: () => void;
    onProgress: (time: number) => void;
    onStalled: () => void;
    onWaiting: () => void;
    requestClip: () => void;
    requestSeek: (time: number) => void;
    requestSeekBack: (difference?: number) => void;
    requestSeekDiff: (difference: number) => void;
    requestSeekForward: (difference?: number) => void;
    requestToggleFullscreen: () => void;
    requestToggleMute: () => void;
    requestTogglePictureInPicture: () => void;
    requestVolume: (volume: number) => void;
    setFullscreen: (fullscreen: boolean) => void;
    setLive: (live: boolean) => void;
    setMounted: () => void;
    setPictureInPicture: (pictureInPicture: boolean) => void;
    setPlaybackRate: (rate: number | string) => void;
    setPoster: (poster: string | null) => void;
    setVideoQuality: (videoQuality: VideoQuality) => void;
    setSize: (size: Partial<MediaSizing>) => void;
    setVolume: (volume: number) => void;
    setWebsocketMetadata: (metadata: Metadata) => void;
    togglePlay: (force?: boolean) => void;
    updateBuffered: (buffered: number) => void;
    updateLastInteraction: () => void;
    updatePlaybackOffsetMs: (offset: number) => void;
  };

  /** The device information and support. */
  __device: DeviceInformation;

  /** The initial props passed into the component. */
  __initialProps: InitialProps;

  __metadata: Metadata | null;
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
  persist: {
    onFinishHydration: (
      fn: (state: MediaControllerState) => void,
    ) => () => void;
  };
};

export const createControllerStore = ({
  device,
  storage,
  src,
  initialProps,
}: {
  device: DeviceInformation;
  storage: ClientStorage;
  src: Src[] | string | null;
  initialProps: Partial<InitialProps>;
}): { store: MediaControllerStore; destroy: () => void } => {
  const resolvedStorage =
    initialProps?.storage === null
      ? createStorage({
          storage: noopStorage,
        })
      : initialProps?.storage ?? storage;

  const initialPlaybackRate = initialProps?.playbackRate ?? 1;
  const initialVolume = getBoundedVolume(
    initialProps.volume ?? DEFAULT_VOLUME_LEVEL,
  );
  const initialVideoQuality = initialProps.videoQuality ?? "auto";

  const sessionToken = generateRandomToken();

  const thumbnailSrc =
    typeof src === "string"
      ? null
      : (src?.find?.((s) => s.type === "image") as ImageSrc | null | undefined);

  const sortedSources = sortSources({
    src,
    screenWidth: device.screenWidth,
    videoQuality: initialVideoQuality,
    aspectRatio: initialProps.aspectRatio ?? 16 / 9,
  });

  const parsedSource = parseCurrentSourceAndPlaybackId({
    accessKey: initialProps?.accessKey ?? null,
    aspectRatio: initialProps?.aspectRatio ?? null,
    constant: initialPlaybackRate === "constant",
    isHlsSupported: device.isHlsSupported,
    jwt: initialProps?.jwt ?? null,
    sessionToken,
    source: sortedSources?.[0] ?? null,
    videoQuality: initialVideoQuality,
  });

  const initialControls: ControlsState = {
    lastError: 0,
    lastInteraction: Date.now(),
    muted: initialVolume === 0,
    playbackId: parsedSource?.playbackId ?? null,
    playbackOffsetMs: null,
    playLastTime: 0,
    requestedClipParams: null,
    requestedFullscreenLastTime: 0,
    requestedPictureInPictureLastTime: 0,
    requestedPlayPauseLastTime: 0,
    requestedRangeToSeekTo: 0,
    sessionToken,
    size: null,
    thumbnail: thumbnailSrc ?? null,
    volume: initialVolume,
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
          currentSource: parsedSource?.currentSource ?? null,

          canPlay: false,
          hidden: false,

          /** Current volume of the media. 0 if it is muted. */
          volume: initialVolume,
          /** The playback rate for the media. Defaults to 1. */
          playbackRate: initialPlaybackRate,
          videoQuality: "auto",

          /** Current progress of the media (in seconds) */
          progress: 0,
          /** Current total duration of the media (in seconds) */
          duration: 0,
          /** Current buffered end time for the media (in seconds) */
          buffered: 0,
          /** Current buffered percent */
          bufferedPercent: 0,

          poster: thumbnailSrc?.src ?? null,

          /** If the video element is mounted on the DOM */
          mounted: false,

          /** If the media is fullscreen. */
          fullscreen: false,
          /** If the media is in picture in picture mode */
          pictureInPicture: false,

          playing: false,
          waiting: false,
          stalled: false,
          loading: true,
          ended: false,

          /** If the media has experienced an error. */
          error: null,
          errorCount: 0,

          /** If the content is live media */
          live: false,

          /** If the media has been played yet. */
          hasPlayed: false,

          /** The sorted sources that were passed in to the Player */
          sortedSources: sortedSources ?? null,

          /** The final playback URL for the media that is playing, after redirects. */
          currentUrl: null,

          aria: {
            progress: "No progress, content is loading",
            fullscreen: "Full screen (f)",
            pictureInPicture: "Mini player (i)",
            playPause: "Play (k)",
            clip: initialProps.clipLength
              ? `Clip last ${Number(initialProps.clipLength).toFixed(
                  0,
                )} seconds (x)`
              : null,
            time: "0:00",
          },

          __initialProps: {
            accessKey: initialProps.accessKey ?? null,
            aspectRatio: initialProps?.aspectRatio ?? null,
            autoPlay: initialProps.autoPlay ?? false,
            clipLength: initialProps.clipLength ?? null,
            hotkeys: initialProps?.hotkeys ?? true,
            jwt: initialProps.jwt ?? null,
            lowLatency: initialProps.lowLatency ?? true,
            onError: initialProps?.onError ?? null,
            playbackRate: initialPlaybackRate,
            posterLiveUpdate: initialProps.posterLiveUpdate ?? 30000,
            preload: initialProps.preload ?? "none",
            storage: resolvedStorage,
            timeout: initialProps.timeout ?? 10000,
            videoQuality: initialVideoQuality,
            viewerId: initialProps.viewerId ?? null,
            volume: initialVolume ?? null,
          },

          __device: device,

          __controls: initialControls,

          __metadata: null,

          __controlsFunctions: {
            setMounted: () =>
              set(() => ({
                mounted: true,
              })),
            setPoster: (poster: string | null) =>
              set(() => ({
                poster,
              })),

            setHidden: (hidden: boolean) =>
              set(({ playing }) => ({
                hidden: playing ? hidden : false,
              })),
            updateLastInteraction: () =>
              set(({ __controls }) => ({
                __controls: { ...__controls, lastInteraction: Date.now() },
              })),

            updatePlaybackOffsetMs: (offset: number) =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  playbackOffsetMs: offset,
                },
              })),

            onCanPlay: () =>
              set(() => ({
                canPlay: true,
                loading: false,
              })),

            onPlay: () =>
              set(({ aria, __controls, __controlsFunctions }) => {
                __controlsFunctions.onError(null);

                const title = "Pause (k)";

                return {
                  playing: true,
                  hasPlayed: true,
                  error: null,
                  errorCount: 0,

                  stalled: false,
                  waiting: false,
                  ended: false,
                  __controls: {
                    ...__controls,
                    playLastTime: Date.now(),
                  },
                  aria: {
                    ...aria,
                    playPause: title,
                  },
                };
              }),
            onPause: () =>
              set(({ aria }) => {
                const title = "Play (k)";

                return {
                  playing: false,
                  hidden: false,
                  // TODO check if these should be getting set when pause event is fired (this was pulled from metrics)
                  stalled: false,
                  waiting: false,
                  ended: false,
                  aria: {
                    ...aria,
                    playPause: title,
                  },
                };
              }),
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
            onProgress: (time) =>
              set(({ aria, progress, duration, live }) => {
                const progressAria = getProgressAria({
                  progress,
                  duration,
                  live,
                });

                const playPauseTitle = "Pause (k)";

                return {
                  aria: {
                    ...aria,
                    progress: progressAria.progress,
                    time: progressAria.time,
                    playPause: playPauseTitle,
                  },
                  progress: getFilteredNaN(time),
                  waiting: false,
                  stalled: false,
                  ended: false,
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

            updateBuffered: (buffered) =>
              set(({ duration }) => {
                const durationFiltered = getFilteredNaN(duration);

                const percent =
                  durationFiltered > 0 && buffered > 0
                    ? (buffered / durationFiltered) * 100
                    : 0;

                return {
                  buffered,
                  bufferedPercent: Number(percent.toFixed(2)),
                };
              }),

            setVideoQuality: (videoQuality) =>
              set(({ __initialProps, __controls, playbackRate, __device }) => {
                const sortedSources = sortSources({
                  src,
                  screenWidth: device.screenWidth,
                  videoQuality,
                  aspectRatio: __initialProps.aspectRatio ?? 16 / 9,
                });

                const parsedSourceNew = parseCurrentSourceAndPlaybackId({
                  accessKey: __initialProps?.accessKey ?? null,
                  aspectRatio: __initialProps?.aspectRatio ?? null,
                  constant: playbackRate === "constant",
                  isHlsSupported: __device.isHlsSupported,
                  jwt: __initialProps?.jwt ?? null,
                  sessionToken: __controls.sessionToken,
                  source: sortedSources?.[0] ?? null,
                  videoQuality,
                });

                return {
                  sortedSources,
                  videoQuality,

                  currentSource: parsedSourceNew?.currentSource ?? null,
                  __controls: {
                    ...__controls,
                    playbackId: parsedSourceNew?.playbackId ?? null,
                  },
                };
              }),

            setPlaybackRate: (rate) =>
              set(() => ({
                playbackRate: getBoundedRate(rate ?? 1),
              })),

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
              set(({ __controls }) => {
                return {
                  __controls: {
                    ...__controls,
                    size: {
                      ...__controls.size,
                      size,
                    },
                  },
                } as const;
              }),
            onWaiting: () => set(() => ({ waiting: true })),
            onStalled: () => set(() => ({ stalled: true })),
            onLoading: () => set(() => ({ loading: true })),
            onEnded: () => set(() => ({ ended: true })),

            setFullscreen: (fullscreen: boolean) =>
              set(({ aria }) => {
                const title = fullscreen
                  ? "Exit full screen (f)"
                  : "Full screen (f)";

                return {
                  fullscreen,
                  aria: {
                    ...aria,
                    fullscreen: title,
                  },
                };
              }),
            requestToggleFullscreen: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedFullscreenLastTime: Date.now(),
                },
              })),

            setPictureInPicture: (pictureInPicture: boolean) =>
              set(({ aria }) => {
                const title = pictureInPicture
                  ? "Exit mini player (i)"
                  : "Mini player (i)";

                return {
                  pictureInPicture,
                  aria: {
                    ...aria,
                    pictureInPicture: title,
                  },
                };
              }),
            requestTogglePictureInPicture: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedPictureInPictureLastTime: Date.now(),
                },
              })),

            setLive: (live: boolean) => set(() => ({ live })),

            requestClip: () =>
              set(({ __controls, __initialProps }) => ({
                __controls: {
                  ...__controls,

                  requestedClipParams: __initialProps.clipLength
                    ? getClipParams({
                        requestedTime: Date.now(),
                        clipLength: __initialProps.clipLength,
                        playbackOffsetMs: __controls.playbackOffsetMs,
                      })
                    : null,
                },
              })),
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
                  muted: newVolume === 0,
                },
              })),

            requestToggleMute: () =>
              set(({ __controls }) => ({
                volume: !__controls.muted ? 0 : __controls.volume,
                __controls: {
                  ...__controls,
                  muted: !__controls.muted,
                },
              })),

            onError: (rawError: Error | null) =>
              set(
                ({
                  currentSource,
                  sortedSources,
                  __controls,
                  errorCount,
                  __device,
                  __initialProps,
                  videoQuality,
                  playbackRate,
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
                          playing: false,
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

                  const currentSourceBaseUrl = currentSource
                    ? new URL(currentSource.src)
                    : "";

                  if (currentSourceBaseUrl) {
                    // Clear the search parameters
                    currentSourceBaseUrl.search = "";
                  }

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
                    accessKey: __initialProps?.accessKey ?? null,
                    aspectRatio: __initialProps?.aspectRatio ?? null,
                    constant: playbackRate === "constant",
                    isHlsSupported: __device.isHlsSupported,
                    jwt: __initialProps?.jwt ?? null,
                    sessionToken: __controls.sessionToken,
                    source: nextSource,
                    videoQuality,
                  });

                  return {
                    ...base,
                    currentSource: parsedSourceNew?.currentSource ?? null,
                    __controls: {
                      ...base.__controls,
                      playbackId: parsedSourceNew?.playbackId ?? null,
                    },
                  };
                },
              ),
          },
        }),
        {
          name: "livepeer-media-controller",
          version: 2,
          // since these values are persisted across media, only persist volume, playbackRate, videoQuality
          partialize: ({ volume, videoQuality }) => ({
            volume,
            videoQuality,
          }),
          storage: createJSONStorage(() => resolvedStorage),
        },
      ),
    ),
  );

  const destroy = store.persist.onFinishHydration(
    ({ videoQuality, volume }) => {
      if (videoQuality !== store.getState().videoQuality) {
        store.getState().__controlsFunctions.setVideoQuality(videoQuality);
      }
      if (volume !== store.getState().volume) {
        store.getState().__controlsFunctions.setVolume(volume);
      }
    },
  );

  return { store, destroy };
};
