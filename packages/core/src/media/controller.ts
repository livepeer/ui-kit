import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { StoreApi, createStore } from 'zustand/vanilla';

import { Src, getMediaSourceType } from './src';
import { ClientStorage } from '../storage';

const DEFAULT_SEEK_TIME = 5000; // milliseconds which the media will skip when seeking with arrows/buttons
export const DEFAULT_VOLUME_LEVEL = 1; // 0-1 for how loud the audio is

export const DEFAULT_AUTOHIDE_TIME = 3000; // milliseconds to wait before hiding controls

const ASSET_URL_PART_VALUE = 'hls';
const WEBRTC_URL_PART_VALUE = 'webrtc';
const RECORDING_URL_PART_VALUE = 'recordings';

const getPlaybackIdFromSourceUrl = (sourceUrl: string) => {
  const parsedUrl = new URL(sourceUrl);

  const parts = parsedUrl.pathname.split('/');

  const includesAssetUrl = parts.includes(ASSET_URL_PART_VALUE);
  const includesWebRtcUrl = parts.includes(WEBRTC_URL_PART_VALUE);
  const includesRecording = parts.includes(RECORDING_URL_PART_VALUE);

  // Check if the url is valid
  const playbackId = includesWebRtcUrl
    ? parts?.[(parts?.length ?? 0) - 1]
    : includesRecording || includesAssetUrl
    ? parts?.[(parts?.length ?? 0) - 2] ?? null
    : null;

  return playbackId;
};

export type DeviceInformation = {
  version: string;
  isMobile: boolean;
  isIos: boolean;
  isAndroid: boolean;
  userAgent: string;
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

export type MediaControllerState<TElement = void, TMediaStream = void> = {
  /** If the media has loaded and can be played */
  canPlay: boolean;
  /** If the controls are currently hidden */
  hidden: boolean;
  /** The last time that the media was interacted with */
  _lastInteraction: number;

  /** Current volume of the media */
  volume: number;
  /** If media is muted */
  muted: boolean;
  /** If media supports changing the volume */
  isVolumeChangeSupported: boolean;

  /** The playbackId that was passed in to the media element */
  playbackId: string | null;
  /** The Source that was passed in to the Player */
  src: Src | null;
  /** The ingest URL that was passed in to the broadcast component */
  ingestUrl: string | null;
  /** If autoplay was passed in to the media element */
  autoplay: boolean;
  /** If priority was passed in to the media element */
  priority: boolean;
  /** The preload option passed in to the media element */
  preload: 'full' | 'metadata' | 'none';
  /** The viewerId for the viewer passed in to Player */
  viewerId: string;
  /** The creatorId for the broadcast component */
  creatorId: string;
  /** The media metadata, from the playback websocket */
  metadata?: Metadata;

  /** The audio and video device IDs for broadcasting */
  deviceIds: {
    audio?: string;
    video?: string;
  } | null;

  /** If the media is current playing or paused */
  playing: boolean;
  /** If the media has been played yet */
  hasPlayed: boolean;
  /** If the media is fullscreen */
  fullscreen: boolean;

  /** The playback rate for the media */
  playbackRate: number;

  /** If the media has an error */
  error?: string;
  /** If the media is currently waiting for data */
  waiting: boolean;
  /** If the media is currently stalled */
  stalled: boolean;
  /** If the media is currently loading */
  loading: boolean;

  /** If the media is in picture in picture mode */
  pictureInPicture: boolean;

  /** The last time that play/pause was requested */
  _requestedPlayPauseLastTime: number;

  /** The last time that fullscreen was changed */
  _requestedFullscreenLastTime: number;

  /** The last time that picture in picture was changed*/
  _requestedPictureInPictureLastTime: number;

  /** If the content is live media */
  live: boolean;

  /** Current progress of the media */
  progress: number;
  /** Current total duration of the media */
  duration: number;

  /** Current buffered end time for the media */
  buffered: number;

  /** Internal value when a user requests an update to the progress of the media */
  _requestedRangeToSeekTo: number;

  /** Internal element used for playing media */
  _element: TElement | null;

  /** Internal MediaStream used for broadcasting */
  _mediaStream: TMediaStream | null;

  /** If video is enabled (only applies to broadcasting) */
  video: boolean | null;

  /** Media sizing information */
  size?: MediaSizing;

  /** Device tracking set on load of the media */
  device: DeviceInformation;

  _updateSource: (source: string) => void;
  _updateMediaStream: (mediaStream: TMediaStream) => void;

  setHidden: (hidden: boolean) => void;
  _updateLastInteraction: () => void;

  setWebsocketMetadata: (metadata: Metadata) => void;

  onCanPlay: () => void;

  onPlay: () => void;
  onPause: () => void;
  togglePlay: (force?: boolean) => void;

  toggleVideo: () => void;

  onProgress: (time: number) => void;
  onDurationChange: (duration: number) => void;

  _updateBuffered: (buffered: number) => void;

  requestSeek: (time: number) => void;

  _setDeviceIds: (ids: { audio?: string; video?: string }) => void;

  requestSeekBack: (difference?: number) => void;
  requestSeekForward: (difference?: number) => void;
  _requestSeekDiff: (difference: number) => void;

  setLive: (live: boolean) => void;

  setSize: (size: MediaSizing) => void;

  setFullscreen: (fullscreen: boolean) => void;
  setPictureInPicture: (pictureInPicture: boolean) => void;
  requestToggleFullscreen: () => void;
  requestTogglePictureInPicture: () => void;

  _setVolume: (volume: number) => void;
  requestVolume: (volume: number) => void;
  requestToggleMute: () => void;
  setIsVolumeChangeSupported: (supported: boolean) => void;

  setWaiting: (waiting: boolean) => void;
  setError: (error: string) => void;
  setStalled: (stalled: boolean) => void;
  setLoading: (stalled: boolean) => void;
};

export type MediaControllerStore<TElement, TMediaStream> = StoreApi<
  MediaControllerState<TElement, TMediaStream>
> & {
  subscribe: {
    (
      listener: (
        selectedState: MediaControllerState<TElement, TMediaStream>,
        previousSelectedState: MediaControllerState<TElement, TMediaStream>,
      ) => void,
    ): () => void;
    <U>(
      selector: (state: MediaControllerState<TElement, TMediaStream>) => U,
      listener: (selectedState: U, previousSelectedState: U) => void,
      options?: {
        equalityFn?: (a: U, b: U) => boolean;
        fireImmediately?: boolean;
      },
    ): () => void;
  };
};

const getFilteredNaN = (value: number | undefined | null) =>
  value && !isNaN(value) && isFinite(value) ? value : 0;

const getBoundedSeek = (seek: number, duration: number | undefined) =>
  Math.min(
    Math.max(0, getFilteredNaN(seek)),
    // seek to near the end
    getFilteredNaN(duration) ? getFilteredNaN(duration) - 0.01 : 0,
  );

const getBoundedVolume = (volume: number) =>
  Math.min(Math.max(0, getFilteredNaN(volume)), 1);

export const createControllerStore = <TElement, TMediaStream>({
  element,
  device,
  storage,
  mediaProps,
  opts,
}: {
  element?: TElement;
  device: DeviceInformation;
  storage: ClientStorage;
  mediaProps: MediaPropsOptions;
  opts: ControlsOptions;
}): MediaControllerStore<TElement, TMediaStream> => {
  const store = createStore<
    MediaControllerState<TElement, TMediaStream>,
    [
      [
        'zustand/subscribeWithSelector',
        Partial<MediaControllerState<TElement, TMediaStream>>,
      ],
      [
        'zustand/persist',
        Partial<MediaControllerState<TElement, TMediaStream>>,
      ],
    ]
  >(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          _element: element ?? null,

          canPlay: false,
          hidden: false,
          live: false,

          ingestUrl: mediaProps.ingestUrl ?? null,
          playbackId: mediaProps.playbackId ?? null,
          src: null,
          autoplay: Boolean(mediaProps.autoPlay),
          muted: Boolean(mediaProps.muted),
          priority: Boolean(mediaProps.priority),
          preload: mediaProps.priority ? 'full' : 'none',
          viewerId: mediaProps.viewerId ?? '',
          creatorId: mediaProps.creatorId ?? '',

          deviceIds: null,

          hasPlayed: false,
          playing: false,
          fullscreen: false,
          pictureInPicture: false,

          waiting: false,
          stalled: false,
          loading: false,
          playbackRate: 1,

          _mediaStream: null,
          video: null,

          device,

          progress: 0,
          duration: 0,

          buffered: 0,

          volume: getBoundedVolume(opts?.defaultVolume ?? DEFAULT_VOLUME_LEVEL),
          isVolumeChangeSupported: false,

          _lastInteraction: Date.now(),

          _requestedRangeToSeekTo: 0,
          _requestedFullscreenLastTime: Date.now(),
          _requestedPictureInPictureLastTime: Date.now(),
          _requestedPlayPauseLastTime: 0,

          _updateMediaStream: (_mediaStream) =>
            set(() => ({ _mediaStream, video: true })),
          setHidden: (hidden: boolean) =>
            set(({ playing }) => ({ hidden: playing ? hidden : false })),
          _updateLastInteraction: () =>
            set(() => ({ _lastInteraction: Date.now(), hidden: false })),

          // set the src and playbackId from the source URL
          _updateSource: (source: string) =>
            set(({ playbackId }) => ({
              src: getMediaSourceType(source),
              ...(!playbackId
                ? { playbackId: getPlaybackIdFromSourceUrl(source) }
                : {}),
            })),

          _setDeviceIds: (ids) =>
            set(({ deviceIds }) => ({
              deviceIds: {
                ...deviceIds,
                ...(ids.audio ? { audio: ids.audio } : {}),
                ...(ids.video ? { video: ids.video } : {}),
              },
            })),

          onCanPlay: () =>
            set(() => ({
              canPlay: true,
              loading: false,
            })),

          onPlay: () =>
            set(() => ({
              playing: true,
              hasPlayed: true,
              stalled: false,
              waiting: false,
            })),
          onPause: () =>
            set(() => ({
              playing: false,
              hidden: false,
              // TODO check if these should be getting set when pause event is fired (this was pulled from metrics)
              stalled: false,
              waiting: false,
            })),
          togglePlay: (force?: boolean) => {
            const { hidden, setHidden, device } = store.getState();
            if (!force && hidden && device.isMobile) {
              setHidden(false);
            } else {
              set(() => ({
                _requestedPlayPauseLastTime: Date.now(),
                _lastInteraction: Date.now(),
              }));
            }
          },
          toggleVideo: () =>
            set(({ video }) => ({
              video: !video,
            })),
          onProgress: (time) =>
            set(() => ({
              progress: getFilteredNaN(time),
              waiting: false,
              stalled: false,
            })),
          requestSeek: (time) =>
            set(({ duration }) => ({
              _requestedRangeToSeekTo: getBoundedSeek(time, duration),
              progress: getBoundedSeek(time, duration),
            })),

          onDurationChange: (duration) =>
            set(({ live }) => ({
              duration,
              live: duration === Number.POSITIVE_INFINITY ? true : live,
            })),

          setWebsocketMetadata: (metadata: Metadata) =>
            set(() => ({ metadata })),

          _updateBuffered: (buffered) => set(() => ({ buffered })),

          _requestSeekDiff: (difference) =>
            set(({ progress, duration }) => ({
              _requestedRangeToSeekTo: getBoundedSeek(
                getFilteredNaN(progress) + difference / 1000,
                duration,
              ),
            })),
          requestSeekBack: (difference = DEFAULT_SEEK_TIME) =>
            get()._requestSeekDiff(-difference),
          requestSeekForward: (difference = DEFAULT_SEEK_TIME) =>
            get()._requestSeekDiff(difference),

          setSize: (size: MediaSizing) => set(() => ({ size })),
          setWaiting: (waiting: boolean) => set(() => ({ waiting })),
          setError: (error: string) => set(() => ({ error })),
          setStalled: (stalled: boolean) => set(() => ({ stalled })),
          setLoading: (loading: boolean) => set(() => ({ loading })),

          setFullscreen: (fullscreen: boolean) => set(() => ({ fullscreen })),
          requestToggleFullscreen: () =>
            set(() => ({
              _requestedFullscreenLastTime: Date.now(),
            })),

          setPictureInPicture: (pictureInPicture: boolean) =>
            set(() => ({ pictureInPicture })),
          requestTogglePictureInPicture: () =>
            set(() => ({
              _requestedPictureInPictureLastTime: Date.now(),
            })),

          setLive: (live: boolean) => set(() => ({ live })),

          requestVolume: (newVolume) =>
            set(({ volume }) => ({
              volume: newVolume === 0 ? volume : getBoundedVolume(newVolume),
              muted: newVolume === 0,
            })),
          _setVolume: (newVolume) =>
            set(() => ({
              volume: getBoundedVolume(newVolume),
            })),

          requestToggleMute: () =>
            set(({ muted }) => ({
              muted: !muted,
            })),

          setIsVolumeChangeSupported: (supported) =>
            set(() => ({
              isVolumeChangeSupported: supported,
            })),
        }),
        {
          name: 'livepeer-player',
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

export type MediaPropsOptions = {
  playbackId?: string;
  autoPlay?: boolean;
  muted?: boolean;
  priority?: boolean;
  viewerId?: string;

  creatorId?: string;
  ingestUrl?: string;
};
