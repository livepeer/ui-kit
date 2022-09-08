import create, { StoreApi } from 'zustand/vanilla';

const VIDEO_CONTROLLER_INITIALIZED_ATTRIBUTE = 'data-controller-initialized';

export type MediaControllerState = {
  element: HTMLMediaElement | null;

  playing: boolean;

  progress: number;
  duration: number;
  _requestedTime: number;

  onPlay: () => void;
  onPause: () => void;
  togglePlay: () => void;

  onProgress: (time: number) => void;
  onSeek: (time: number) => void;

  onDurationChange: (duration: number) => void;
  onSeekBackward: (difference?: number) => void;
};

export type MediaControllerStore = StoreApi<MediaControllerState>;

export const registerEventListeners = (element: HTMLMediaElement | null) => {
  const store = create<MediaControllerState>((set) => ({
    element: element,

    playing: !element?.paused,
    progress: element?.currentTime ?? 0,
    duration: element?.duration ?? 0,
    _requestedTime: 0,

    onPlay: () => set(() => ({ playing: true })),
    onPause: () => set(() => ({ playing: false })),
    togglePlay: () => set((state) => ({ playing: !state.playing })),

    onProgress: (time) => set(() => ({ progress: time })),
    onSeek: (time) => set(() => ({ _requestedTime: time, progress: time })),

    onDurationChange: (duration) => set(() => ({ duration })),
    onSeekBackward: (difference = 5) =>
      set(({ element }) => ({
        _requestedTime: element?.currentTime
          ? Math.max(element.currentTime - difference, 0)
          : 0,
      })),
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

    store.subscribe((current, prev) => {
      console.log({ current, prev });

      if (current.playing !== prev.playing) {
        return current.playing ? element.play() : element.pause();
      }
      if (current._requestedTime !== prev._requestedTime) {
        // Can't set the time before the media is ready
        // Ignore if readyState isn't supported
        if (element.readyState > 0 || element.readyState === undefined) {
          return (element.currentTime = current._requestedTime);
        }
      }
    });
  }

  return store;
};
