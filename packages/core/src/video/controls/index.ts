import { persist } from 'zustand/middleware';
import create, { StoreApi } from 'zustand/vanilla';

const MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE = 'data-controller-initialized';

export type MediaControllerState<TElement extends HTMLMediaElement> = {
  /** If the controls are currently hidden */
  hidden: boolean;
  /** The last time that the media was interacted with */
  _lastInteraction: number;

  /** Current volume of the video */
  volume: number;

  /** If the element is current playing or paused */
  playing: boolean;
  /** If the element is fullscreen */
  fullscreen: boolean;
  /** The last time that fullscreen was changed */
  _requestedFullscreenLastTime: number;

  /** Current progress of the video */
  progress: number;
  /** Current total duration of the video */
  duration: number;

  /** Internal value when a user requests an update to the progress of the video */
  _requestedRangeToSeekTo: number;

  /** Internal HTMLMediaElement (or extended class) used for toggling media events */
  _element: TElement | null;

  setHidden: (hidden: boolean) => void;
  _updateLastInteraction: () => void;

  onPlay: () => void;
  onPause: () => void;
  togglePlay: () => void;

  onProgress: (time: number) => void;
  onDurationChange: (duration: number) => void;

  requestSeek: (time: number) => void;

  requestSeekBack: (difference?: number) => void;
  requestSeekForward: (difference?: number) => void;
  _requestSeekDiff: (difference: number) => void;

  setFullscreen: (fullscreen: boolean) => void;
  requestToggleFullscreen: () => void;

  requestVolume: (volume: number) => void;
};

export type MediaControllerStore<TElement extends HTMLMediaElement> = StoreApi<
  MediaControllerState<TElement>
>;

export const allKeyTriggers = [
  'KeyF',
  'Space',
  'ArrowRight',
  'ArrowLeft',
] as const;
export type KeyTrigger = typeof allKeyTriggers[number];

const DEFAULT_SEEK_TIME = 5000; // milliseconds which the media will skip when seeking with arrows/buttons
const DEFAULT_AUTOHIDE_TIME = 3000; // milliseconds to wait before hiding controls
const DEFAULT_VOLUME_LEVEL = 0.2; // 0-1 for how loud the audio is

export const createControllerStore = <TElement extends HTMLMediaElement>(
  element: TElement | null,
) => {
  const getBoundedSeek = (seek: number) =>
    Math.min(
      Math.max(0, seek),
      // seek to near the end
      element?.duration ? element.duration - 0.01 : 0,
    );

  const getBoundedVolume = (volume: number) => Math.min(Math.max(0, volume), 1);

  const store = create<
    MediaControllerState<TElement>,
    [['zustand/persist', Partial<MediaControllerState<TElement>>]]
  >(
    persist(
      (set, get) => ({
        _element: element,

        hidden: false,

        playing: false,
        fullscreen: false,

        progress: element?.currentTime ?? 0,
        duration: element?.duration ?? 0,

        volume: element?.volume ?? DEFAULT_VOLUME_LEVEL,

        _lastInteraction: Date.now(),

        _requestedRangeToSeekTo: 0,
        _requestedFullscreenLastTime: Date.now(),

        setHidden: (hidden: boolean) =>
          set(({ playing }) => ({ hidden: playing ? hidden : false })),
        _updateLastInteraction: () =>
          set(() => ({ _lastInteraction: Date.now() })),

        onPlay: () => set(() => ({ playing: true })),
        onPause: () => set(() => ({ playing: false, hidden: false })),
        togglePlay: () => set(({ playing }) => ({ playing: !playing })),
        onProgress: (time) => set(() => ({ progress: time })),
        requestSeek: (time) =>
          set(() => ({
            _requestedRangeToSeekTo: getBoundedSeek(time),
            progress: time,
          })),

        onDurationChange: (duration) => set(() => ({ duration })),

        _requestSeekDiff: (difference) =>
          set(() => ({
            _requestedRangeToSeekTo: getBoundedSeek(
              (element?.currentTime ?? 0) + difference / 1000,
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

        requestVolume: (volume) =>
          set(() => ({ volume: getBoundedVolume(volume) })),
      }),
      {
        name: 'livepeer-player',
        version: 1,
        partialize: ({ volume }) => ({ volume }),
      },
    ),
  );

  // restore the persisted values from store
  if (element) {
    element.volume = store.getState().volume;
  }

  return store;
};

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export type ControlsOptions = {
  /** If hotkeys should be enabled on the video element (arrows to seek, etc) */
  hotkeys?: boolean;
  /** Auto-hide controls after a set amount of time (in milliseconds). Set to 0 for no hiding. */
  autohide?: number;
};

export const addEventListeners = <TElement extends HTMLMediaElement>(
  store: MediaControllerStore<TElement>,
  { hotkeys = true, autohide = DEFAULT_AUTOHIDE_TIME }: ControlsOptions = {},
) => {
  const onPlay = () => store.getState().onPlay();
  const onPause = () => store.getState().onPause();

  const onDurationChange = () =>
    store.getState().onDurationChange(element?.duration ?? 0);

  const onTimeUpdate = () =>
    store.getState().onProgress(element?.currentTime ?? 0);

  const onKeyUp = (e: KeyboardEvent) => {
    const code = e.code as KeyTrigger;

    store.getState()._updateLastInteraction();

    if (allKeyTriggers.includes(code)) {
      if (code === 'Space') {
        store.getState().togglePlay();
      } else if (code === 'KeyF') {
        store.getState().requestToggleFullscreen();
      } else if (code === 'ArrowRight') {
        store.getState().requestSeekForward();
      } else if (code === 'ArrowLeft') {
        store.getState().requestSeekBack();
      }
    }
  };

  const onMouseEnter = () => {
    if (autohide) {
      store.getState().setHidden(false);
    }
  };
  const onMouseLeave = () => {
    if (autohide) {
      // store.getState().setHidden(true);
    }
  };
  const onMouseMove = async () => {
    store.getState()._updateLastInteraction();
  };

  const onVolumeChange = () => {
    if (
      typeof element?.volume !== 'undefined' &&
      element?.volume !== store.getState().volume
    ) {
      store.getState().requestVolume(element.volume);
    }
  };

  const element = store?.getState()?._element;

  if (element) {
    element.addEventListener('play', onPlay);
    element.addEventListener('pause', onPause);
    element.addEventListener('durationchange', onDurationChange);
    element.addEventListener('timeupdate', onTimeUpdate);
    element.addEventListener('volumechange', onVolumeChange);

    const parentElementOrElement = element?.parentElement ?? element;

    if (hotkeys) {
      parentElementOrElement.addEventListener('keyup', onKeyUp);
    }
    if (autohide) {
      parentElementOrElement.addEventListener('mouseenter', onMouseEnter);
      parentElementOrElement.addEventListener('mouseleave', onMouseLeave);
      parentElementOrElement.addEventListener('mousemove', onMouseMove);
    }

    element.setAttribute(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE, 'true');
  }

  const onFullScreenChange = (e: Event) => {
    const isFullscreenElementPresent = Boolean(
      document.fullscreenElement ||
        document['webkitCurrentFullScreenElement' as 'fullscreenElement'] ||
        document['webkitFullscreenElement' as 'fullscreenElement'],
    );

    const eventTargetIncludesElement = Boolean(
      (e?.target as Element)?.contains?.(element),
    );

    if (eventTargetIncludesElement) {
      store.getState().setFullscreen(Boolean(isFullscreenElementPresent));
    }
  };

  // add effects
  const removeEffectsFromStore = addEffectsToStore(store, element, {
    autohide,
  });

  document?.addEventListener('fullscreenchange', onFullScreenChange);

  return {
    destroy: () => {
      document?.removeEventListener?.('fullscreenchange', onFullScreenChange);

      element?.removeEventListener?.('play', onPlay);
      element?.removeEventListener?.('pause', onPause);
      element?.removeEventListener?.('durationchange', onDurationChange);
      element?.removeEventListener?.('timeupdate', onTimeUpdate);

      const parentElementOrElement = element?.parentElement ?? element;

      parentElementOrElement?.removeEventListener?.('keyup', onKeyUp);

      parentElementOrElement?.removeEventListener?.('mouseenter', onMouseEnter);
      parentElementOrElement?.removeEventListener?.('mouseleave', onMouseLeave);
      parentElementOrElement?.removeEventListener?.('mousemove', onMouseMove);

      removeEffectsFromStore?.();

      store?.destroy?.();

      element?.removeAttribute?.(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE);
    },
  };
};

const addEffectsToStore = <TElement extends HTMLMediaElement>(
  store: StoreApi<MediaControllerState<TElement>>,
  element: HTMLMediaElement | null,
  options: Required<Pick<ControlsOptions, 'autohide'>>,
) => {
  // add effects to store changes
  return store.subscribe(async (current, prev) => {
    if (element) {
      // console.log({ current, prev });

      if (current.playing !== prev.playing) {
        return current.playing ? element.play() : element.pause();
      }

      if (current.volume !== prev.volume) {
        return (element.volume = current.volume);
      }

      if (current._requestedRangeToSeekTo !== prev._requestedRangeToSeekTo) {
        // Can't set the time before the media is ready
        // Ignore if readyState isn't supported
        if (element.readyState > 0 || element.readyState === undefined) {
          return (element.currentTime = current._requestedRangeToSeekTo);
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
          return store.getState().setHidden(true);
        } else {
          return;
        }
      }

      if (
        current._requestedFullscreenLastTime !==
        prev._requestedFullscreenLastTime
      ) {
        const isFullscreenElementPresent = Boolean(
          document.fullscreenElement ||
            document['webkitCurrentFullScreenElement' as 'fullscreenElement'] ||
            document['webkitFullscreenElement' as 'fullscreenElement'],
        );

        // try all browser variations (modern, old safari, old firefox, old IE)
        if (!isFullscreenElementPresent) {
          const fullscreenFunc =
            element?.parentElement?.requestFullscreen ??
            element?.parentElement?.[
              'webkitRequestFullscreen' as 'requestFullscreen'
            ] ??
            element?.parentElement?.[
              'mozRequestFullScreen' as 'requestFullscreen'
            ] ??
            element?.parentElement?.[
              'msRequestFullscreen' as 'requestFullscreen'
            ];
          // retain the element "this" in the call
          return fullscreenFunc?.call?.(element?.parentElement);
        } else if (isFullscreenElementPresent) {
          const exitFullscreenFunc =
            document?.exitFullscreen ??
            document?.['webkitExitFullscreen' as 'exitFullscreen'] ??
            document?.['mozExitFullScreen' as 'exitFullscreen'] ??
            document?.['msExitFullscreen' as 'exitFullscreen'];
          // retain the element "this" in the call
          return exitFullscreenFunc?.call?.(document);
        }
      }
    }
  });
};
