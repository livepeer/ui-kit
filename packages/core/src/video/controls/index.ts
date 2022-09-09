import create, { StoreApi } from 'zustand/vanilla';

import { addEffectsToStore } from './effects';

const VIDEO_CONTROLLER_INITIALIZED_ATTRIBUTE = 'data-controller-initialized';

export type MediaControllerState = {
  /** if the element is current playing or paused */
  playing: boolean;
  /** if the element is fullscreen */
  fullscreen: boolean;

  /** current progress of the video */
  progress: number;
  /** current total duration of the video */
  duration: number;

  /** internal value when a user requests an update to the progress of the video */
  _requestedRangeToSeekTo: number;

  onPlay: () => void;
  onPause: () => void;
  togglePlay: () => void;

  onProgress: (time: number) => void;
  onRequestSeek: (time: number) => void;

  onDurationChange: (duration: number) => void;
  onSeekBackward: (difference?: number) => void;

  onToggleFullscreen: () => void;
};

export type MediaControllerStore = StoreApi<MediaControllerState>;

export const createControllerStore = (element: HTMLMediaElement | null) => {
  const store = create<MediaControllerState>((set) => ({
    playing: !element?.paused,
    fullscreen: false,

    progress: element?.currentTime ?? 0,
    duration: element?.duration ?? 0,

    _requestedRangeToSeekTo: 0,

    onPlay: () => set(() => ({ playing: true })),
    onPause: () => set(() => ({ playing: false })),
    togglePlay: () => set(({ playing }) => ({ playing: !playing })),

    onProgress: (time) => set(() => ({ progress: time })),
    onRequestSeek: (time) =>
      set(() => ({ _requestedTime: time, progress: time })),

    onDurationChange: (duration) => set(() => ({ duration })),
    onSeekBackward: (difference = 5) =>
      set(() => ({
        _requestedRangeToSeekTo: element?.currentTime
          ? Math.max(element.currentTime - difference, 0)
          : 0,
      })),

    onToggleFullscreen: () =>
      set(({ fullscreen }) => ({ fullscreen: !fullscreen })),
  }));

  if (element) {
    element.addEventListener('play', () => store.getState().onPlay());
    element.addEventListener('pause', () => store.getState().onPause());
    element.addEventListener('click', () => store.getState().togglePlay());

    element.addEventListener('durationchange', () => {
      store.getState().onDurationChange(element.duration ?? 0);
    });
    element.addEventListener('progress', () => {
      if (element.currentTime !== store.getState().progress) {
        store.getState().onProgress(element.currentTime ?? 0);
      }
    });

    element.setAttribute(VIDEO_CONTROLLER_INITIALIZED_ATTRIBUTE, 'true');

    // add effects
    addEffectsToStore(element, store);
  }

  return store;
};
