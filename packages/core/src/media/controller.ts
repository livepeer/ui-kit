import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import { StoreApi, createStore } from "zustand/vanilla";

import { ClientStorage } from "../storage";
import { getPlaybackIdFromSourceUrl } from "./metrics/utils";
import { Src, getMediaSourceType } from "./src";

import { omit } from "../utils";

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
  /** The last time that a clip was requested */
  requestedClipLastTime: number;
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

  /** Media sizing information */
  size: MediaSizing | null;

  /** If the volume is muted */
  muted: boolean;
  /** The volume, doesn't change when muted */
  volume: number;
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

  /** If the media is fullscreen. */
  fullscreen: boolean;
  /** If the media is in picture in picture mode */
  pictureInPicture: boolean;

  /** The playback state of the media. */
  playbackState: PlaybackState;
  /** If the media has experienced an error. */
  error: PlaybackError | null;

  /** If all controls are currently hidden */
  hidden: boolean;
  /** If the content is live media */
  live: boolean;
  /** Session token for the current playback */
  sessionToken: string;

  /** If the media has been played yet. */
  hasPlayed: boolean;

  /** The ingest URL that was passed in to the Broadcast */
  inputIngest: string | null;
  /** The source that was passed in to the Player */
  inputSource: Src[] | string | null;
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
    updateSource: (source: string) => void;
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

    setError: (error: PlaybackError | null) => void;

    setLive: (live: boolean) => void;

    setSize: (size: MediaSizing) => void;

    setFullscreen: (fullscreen: boolean) => void;
    setPictureInPicture: (pictureInPicture: boolean) => void;
    requestToggleFullscreen: () => void;
    requestTogglePictureInPicture: () => void;
    requestClip: () => void;

    setVolume: (volume: number) => void;
    requestVolume: (volume: number) => void;
    requestToggleMute: () => void;

    generateNewPlaybackToken: () => void;

    onRedirect: (url: string | null) => void;
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

          /** If the content is live media */
          live: false,
          /** Session token for the current playback */
          sessionToken: generateRandomToken(),

          /** If the media has been played yet. */
          hasPlayed: false,

          /** The ingest URL that was passed in to the Broadcast */
          inputIngest: null,
          /** The source that was passed in to the Player */
          inputSource: src ?? null,
          /** The current source that is playing. */
          currentSource:
            (typeof src === "string" ? getMediaSourceType(src) : src?.[0]) ??
            null,
          /** The final playback URL for the media that is playing, after redirects. */
          currentUrl: null,

          __initialProps: {
            volume: initialVolume ?? null,
            playbackRate: initialProps.playbackRate ?? 1,

            autoPlay: initialProps.autoPlay ?? false,
            creatorId: initialProps.creatorId ?? null,
            preload: initialProps.preload ?? "none",
            viewerId: initialProps.viewerId ?? null,
          },

          __device: device,

          __controls: {
            requestedRangeToSeekTo: 0,
            requestedClipLastTime: Date.now(),
            requestedFullscreenLastTime: Date.now(),
            requestedPictureInPictureLastTime: Date.now(),
            requestedPlayPauseLastTime: 0,
            playLastTime: 0,
            playbackOffsetMs: null,
            lastInteraction: Date.now(),
            playbackId: null,
            size: null,
            volume: initialVolume,
            muted: initialVolume === 0,
          },

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
            updateSource: (source: string) =>
              set(({ __controls }) => ({
                src: getMediaSourceType(source),
                ...(!__controls?.playbackId
                  ? {
                      __controls: {
                        ...__controls,
                        playbackId: getPlaybackIdFromSourceUrl(source),
                      },
                    }
                  : {}),
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
                playbackState: "canPlay",
              })),

            onPlay: () =>
              set(({ __controls }) => ({
                playbackState: "playing",
                hasPlayed: true,
                __controls: {
                  ...__controls,
                  playLastTime: Date.now(),
                },
              })),
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
              set(({ playbackState }) => ({
                progress: getFilteredNaN(time),
                ...(playbackState !== "playing"
                  ? { playbackState: "playing" }
                  : {}),
              })),
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

            setError: (error: PlaybackError | null) =>
              set(() => ({
                error,
                playbackState: "error",
              })),

            generateNewPlaybackToken: () =>
              set(() => ({ sessionToken: generateRandomToken() })),

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

            onRedirect: (currentUrl: string | null) =>
              set(() => ({ currentUrl })),

            setSize: (size: MediaSizing) =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  size,
                },
              })),
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
            requestClip: () =>
              set(({ __controls }) => ({
                __controls: {
                  ...__controls,
                  requestedClipLastTime: Date.now(),
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
              set(({ __controls }) => ({
                volume: !__controls.muted ? 0 : __controls.volume,
                __controls: {
                  ...__controls,
                  muted: !__controls.muted,
                },
              })),
          },
        }),
        {
          name: "livepeer-player",
          version: 1,
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
