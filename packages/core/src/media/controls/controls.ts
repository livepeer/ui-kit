import { persist } from 'zustand/middleware';
import create, { StoreApi } from 'zustand/vanilla';

import { isAndroid, isIos, isMobile } from '../browser';

import {
  addFullscreenEventListener,
  enterFullscreen,
  exitFullscreen,
  isCurrentlyFullscreen,
} from './fullscreen';
import {
  addEnterPictureInPictureEventListener,
  addExitPictureInPictureEventListener,
  enterPictureInPicture,
  exitPictureInPicture,
  isCurrentlyPictureInPicture,
} from './pictureInPicture';

const MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE = 'data-controller-initialized';

export type MediaControllerState<TElement extends HTMLMediaElement> = {
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

  /** If the element is current playing or paused */
  playing: boolean;
  /** If the element has been played yet */
  hasPlayed: boolean;
  /** If the element is fullscreen */
  fullscreen: boolean;

  /** If the element is in picture in picture mode */
  pictureInPicture: boolean;

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

  /** Internal HTMLMediaElement (or extended class) used for toggling media events */
  _element: TElement | null;

  /** Device tracking set on load of the media */
  device: {
    isMobile: boolean;
    isIos: boolean;
    isAndroid: boolean;
  };

  setHidden: (hidden: boolean) => void;
  _updateLastInteraction: () => void;

  onCanPlay: () => void;

  onPlay: () => void;
  onPause: () => void;
  togglePlay: () => void;

  onProgress: (time: number) => void;
  onDurationChange: (duration: number) => void;

  _updateBuffered: (buffered: number) => void;

  requestSeek: (time: number) => void;

  requestSeekBack: (difference?: number) => void;
  requestSeekForward: (difference?: number) => void;
  _requestSeekDiff: (difference: number) => void;

  setLive: (fullscreen: boolean) => void;

  setFullscreen: (fullscreen: boolean) => void;
  setPictureInPicture: (pictureInPicture: boolean) => void;
  requestToggleFullscreen: () => void;
  requestTogglePictureInPicture: () => void;

  _setVolume: (volume: number) => void;
  requestVolume: (volume: number) => void;
  requestToggleMute: () => void;
  setIsVolumeChangeSupported: (supported: boolean) => void;
};

export type MediaControllerStore<TElement extends HTMLMediaElement> = StoreApi<
  MediaControllerState<TElement>
>;

export const allKeyTriggers = [
  'KeyF',
  'KeyK',
  'KeyM',
  'KeyI',
  'Space',
  'ArrowRight',
  'ArrowLeft',
] as const;
export type KeyTrigger = typeof allKeyTriggers[number];

const DEFAULT_SEEK_TIME = 5000; // milliseconds which the media will skip when seeking with arrows/buttons
const DEFAULT_AUTOHIDE_TIME = 3000; // milliseconds to wait before hiding controls
const DEFAULT_VOLUME_LEVEL = 0.2; // 0-1 for how loud the audio is

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

// if volume change is unsupported, the element will always return 1
// similar to https://github.com/videojs/video.js/pull/7514/files

const getIsVolumeChangeSupported = <TElement extends HTMLMediaElement>(
  element: TElement,
) => {
  return new Promise<boolean>((resolve) => {
    const prevVolume = element?.volume ?? DEFAULT_VOLUME_LEVEL;

    const newVolume = prevVolume - 0.01;

    // set new value and test
    element.volume = newVolume;

    window.setTimeout(() => {
      const isSupported = element.volume !== 1;

      // reset to old value
      element.volume = prevVolume;

      resolve(isSupported);
    });
  });
};

export const createControllerStore = <TElement extends HTMLMediaElement>(
  element: TElement | null,
) => {
  const store = create<
    MediaControllerState<TElement>,
    [['zustand/persist', Partial<MediaControllerState<TElement>>]]
  >(
    persist(
      (set, get) => ({
        _element: element,

        canPlay: false,
        hidden: false,
        live: false,

        hasPlayed: false,
        playing: !element?.paused,
        fullscreen: false,
        pictureInPicture: false,

        device: {
          isMobile: isMobile(),
          isIos: isIos(),
          isAndroid: isAndroid(),
        },

        progress: getFilteredNaN(element?.currentTime),
        duration: getFilteredNaN(element?.duration),

        buffered: 0,

        volume: element?.volume ?? DEFAULT_VOLUME_LEVEL,
        muted: element?.muted ?? element?.defaultMuted ?? true,
        isVolumeChangeSupported: false,

        _lastInteraction: Date.now(),

        _requestedRangeToSeekTo: 0,
        _requestedFullscreenLastTime: Date.now(),
        _requestedPictureInPictureLastTime: Date.now(),

        setHidden: (hidden: boolean) =>
          set(({ playing }) => ({ hidden: playing ? hidden : false })),
        _updateLastInteraction: () =>
          set(() => ({ _lastInteraction: Date.now() })),

        onCanPlay: () =>
          set(() => ({
            canPlay: true,
          })),

        onPlay: () =>
          set(() => ({
            playing: true,
            _lastInteraction: Date.now(),
            hasPlayed: true,
          })),
        onPause: () => set(() => ({ playing: false, hidden: false })),
        togglePlay: () => set(({ playing }) => ({ playing: !playing })),
        onProgress: (time) => set(() => ({ progress: getFilteredNaN(time) })),
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

        _updateBuffered: (buffered) => set(() => ({ buffered })),

        _requestSeekDiff: (difference) =>
          set(({ duration }) => ({
            _requestedRangeToSeekTo: getBoundedSeek(
              getFilteredNaN(element?.currentTime ?? 0) + difference / 1000,
              duration,
            ),
          })),
        requestSeekBack: (difference = DEFAULT_SEEK_TIME) =>
          get()._requestSeekDiff(-difference),
        requestSeekForward: (difference = DEFAULT_SEEK_TIME) =>
          get()._requestSeekDiff(difference),

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
        // since these values are persisted across media elements, only persist volume
        partialize: ({ volume }) => ({
          volume,
        }),
      },
    ),
  );

  const initializedState = store.getState();

  // restore the persisted values from store
  if (element && !element.muted && !element.defaultMuted) {
    element.volume = initializedState.volume;
  }

  return store;
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export type ControlsOptions = {
  /** If hotkeys should be enabled on the media element (arrows to seek, etc) */
  hotkeys?: boolean;
  /** Auto-hide controls after a set amount of time (in milliseconds). Defaults to 3000. Set to 0 for no hiding. */
  autohide?: number;
};

export const addEventListeners = <TElement extends HTMLMediaElement>(
  store: MediaControllerStore<TElement>,
  { hotkeys = true, autohide = DEFAULT_AUTOHIDE_TIME }: ControlsOptions = {},
) => {
  const element = store?.getState()?._element;

  const onCanPlay = () => store.getState().onCanPlay();

  const onPlay = () => store.getState().onPlay();
  const onPause = () => store.getState().onPause();

  const onDurationChange = () =>
    store.getState().onDurationChange(element?.duration ?? 0);

  const onTimeUpdate = () =>
    store.getState().onProgress(element?.currentTime ?? 0);

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const code = e.code as KeyTrigger;

    store.getState()._updateLastInteraction();

    if (allKeyTriggers.includes(code)) {
      if (code === 'Space' || code === 'KeyK') {
        store.getState().togglePlay();
      } else if (code === 'KeyF') {
        store.getState().requestToggleFullscreen();
      } else if (code === 'KeyI') {
        store.getState().requestTogglePictureInPicture();
      } else if (code === 'ArrowRight') {
        store.getState().requestSeekForward();
      } else if (code === 'ArrowLeft') {
        store.getState().requestSeekBack();
      } else if (code === 'KeyM') {
        store.getState().requestToggleMute();
      }
    }
  };

  const onMouseEnter = () => {
    store.getState()._updateLastInteraction();
  };
  const onMouseLeave = () => {
    if (autohide) {
      store.getState().setHidden(true);
    }
  };
  const onMouseMove = async () => {
    store.getState()._updateLastInteraction();
  };

  const onTouchUpdate = async () => {
    store.getState()._updateLastInteraction();
  };

  const onVolumeChange = () => {
    if (
      typeof element?.volume !== 'undefined' &&
      element?.volume !== store.getState().volume
    ) {
      store.getState()._setVolume(element.volume);
    }
  };

  const onProgress = () => {
    if (element && (element?.duration ?? 0) > 0) {
      const currentTime = element.currentTime;

      const buffered = [...Array(element.buffered.length)].reduce(
        (prev, _curr, i) => {
          const start = element.buffered.start(element.buffered.length - 1 - i);
          const end = element.buffered.end(element.buffered.length - 1 - i);

          // if the TimeRange covers the current time, then use this value
          if (start <= currentTime && end >= currentTime) {
            return end;
          }

          return prev;
        },
        // default to end of media
        store?.getState?.()?.duration ?? 0,
      );

      store.getState()._updateBuffered(buffered);
    }
  };

  let retryCount = 0;

  const onError = async () => {
    await new Promise((r) => setTimeout(r, 1000 * ++retryCount));
    element?.load();
  };

  if (element) {
    element.addEventListener('volumechange', onVolumeChange);

    element.addEventListener('canplay', onCanPlay);
    element.addEventListener('play', onPlay);
    element.addEventListener('pause', onPause);
    element.addEventListener('durationchange', onDurationChange);
    element.addEventListener('timeupdate', onTimeUpdate);
    element.addEventListener('progress', onProgress);
    element.addEventListener('error', onError);

    const parentElementOrElement = element?.parentElement ?? element;

    if (hotkeys) {
      parentElementOrElement.addEventListener('keyup', onKeyUp);
    }
    if (autohide) {
      parentElementOrElement.addEventListener('mouseenter', onMouseEnter);
      parentElementOrElement.addEventListener('mouseleave', onMouseLeave);
      parentElementOrElement.addEventListener('mousemove', onMouseMove);

      parentElementOrElement.addEventListener('touchstart', onTouchUpdate);
      parentElementOrElement.addEventListener('touchend', onTouchUpdate);
      parentElementOrElement.addEventListener('touchmove', onTouchUpdate);
    }

    element.load();

    getIsVolumeChangeSupported(element).then((isVolumeChangeSupported) =>
      store.getState().setIsVolumeChangeSupported(isVolumeChangeSupported),
    );

    element.setAttribute(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE, 'true');
  }

  const onFullscreenChange = () => {
    store.getState().setFullscreen(isCurrentlyFullscreen(element));
  };

  const onEnterPictureInPicture = () => {
    store.getState().setPictureInPicture(true);
  };
  const onExitPictureInPicture = () => {
    store.getState().setPictureInPicture(false);
  };

  // add effects
  const removeEffectsFromStore = addEffectsToStore(store, element, {
    autohide,
  });

  // add fullscreen listener
  const removeFullscreenListener = addFullscreenEventListener(
    element,
    onFullscreenChange,
  );

  // add picture in picture listeners
  const removeEnterPictureInPictureListener =
    addEnterPictureInPictureEventListener(element, onEnterPictureInPicture);
  const removeExitPictureInPictureListener =
    addExitPictureInPictureEventListener(element, onExitPictureInPicture);

  return {
    destroy: () => {
      removeFullscreenListener?.();

      removeEnterPictureInPictureListener?.();
      removeExitPictureInPictureListener?.();

      element?.removeEventListener?.('canplay', onCanPlay);
      element?.removeEventListener?.('play', onPlay);
      element?.removeEventListener?.('pause', onPause);
      element?.removeEventListener?.('durationchange', onDurationChange);
      element?.removeEventListener?.('timeupdate', onTimeUpdate);
      element?.removeEventListener?.('progress', onProgress);

      const parentElementOrElement = element?.parentElement ?? element;

      parentElementOrElement?.removeEventListener?.('keyup', onKeyUp);

      parentElementOrElement?.removeEventListener?.('mouseenter', onMouseEnter);
      parentElementOrElement?.removeEventListener?.('mouseleave', onMouseLeave);
      parentElementOrElement?.removeEventListener?.('mousemove', onMouseMove);

      parentElementOrElement?.addEventListener?.('touchstart', onTouchUpdate);
      parentElementOrElement?.addEventListener?.('touchend', onTouchUpdate);
      parentElementOrElement?.addEventListener?.('touchmove', onTouchUpdate);

      removeEffectsFromStore?.();

      store?.destroy?.();

      element?.removeAttribute?.(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE);
    },
  };
};

let previousPromise: Promise<void> | Promise<null> | boolean | null;

const addEffectsToStore = <TElement extends HTMLMediaElement>(
  store: StoreApi<MediaControllerState<TElement>>,
  element: HTMLMediaElement | null,
  options: Required<Pick<ControlsOptions, 'autohide'>>,
) => {
  // add effects to store changes
  return store.subscribe(async (current, prev) => {
    try {
      if (element) {
        if (previousPromise) {
          try {
            // wait for the previous promise to execute before handling the next effect
            await previousPromise;
          } catch (e) {
            console.warn(e);
          }
        }

        if (current.playing !== prev.playing) {
          if (current.playing) {
            previousPromise = element.play();
          } else {
            element.pause();
          }
        }

        if (current.volume !== prev.volume) {
          element.volume = current.volume;
        }

        if (current.muted !== prev.muted) {
          element.muted = current.muted;
          if (current.volume === 0) {
            element.volume = DEFAULT_VOLUME_LEVEL;
          }
        }

        if (current._requestedRangeToSeekTo !== prev._requestedRangeToSeekTo) {
          // Can't set the time before the media is ready
          // Ignore if readyState isn't supported
          if (
            typeof element.readyState === 'undefined' ||
            element.readyState > 0
          ) {
            element.currentTime = current._requestedRangeToSeekTo;
          }
        }

        // user has interacted with element
        if (
          options.autohide &&
          current._lastInteraction !== prev._lastInteraction
        ) {
          store.getState().setHidden(false);

          await delay(options.autohide);

          if (
            !store.getState().hidden &&
            current._lastInteraction === store.getState()._lastInteraction
          ) {
            store.getState().setHidden(true);
          }
        }

        if (
          current._requestedFullscreenLastTime !==
          prev._requestedFullscreenLastTime
        ) {
          const isFullscreen = isCurrentlyFullscreen(element);

          if (!isFullscreen) {
            previousPromise = enterFullscreen(element);
          } else {
            previousPromise = exitFullscreen(element);
          }
        }

        if (
          current._requestedPictureInPictureLastTime !==
          prev._requestedPictureInPictureLastTime
        ) {
          const isPictureInPicture = isCurrentlyPictureInPicture(element);

          if (!isPictureInPicture) {
            previousPromise = enterPictureInPicture(element);
          } else {
            previousPromise = exitPictureInPicture(element);
          }
        }
      }
    } catch (e) {
      console.warn(e);
    }
  });
};
