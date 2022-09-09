import { StoreApi } from 'zustand/vanilla';

import { MediaControllerState } from '.';

export const addEffectsToStore = (
  element: HTMLMediaElement,
  store: StoreApi<MediaControllerState>,
) => {
  // add effects to store changes
  store.subscribe((current, prev) => {
    console.log({ current, prev });

    if (current.playing !== prev.playing) {
      return current.playing ? element.play() : element.pause();
    }
    if (current._requestedRangeToSeekTo !== prev._requestedRangeToSeekTo) {
      // Can't set the time before the media is ready
      // Ignore if readyState isn't supported
      if (element.readyState > 0 || element.readyState === undefined) {
        return (element.currentTime = current._requestedRangeToSeekTo);
      }
    }
    if (current.fullscreen !== prev.fullscreen) {
      if (current.fullscreen) {
        // try all browser variations (modern, old safari, old firefox, old IE)
        const fullscreenFunc =
          element?.requestFullscreen ??
          element?.['webkitRequestFullscreen' as 'requestFullscreen'] ??
          element?.['mozRequestFullScreen' as 'requestFullscreen'] ??
          element?.['msRequestFullscreen' as 'requestFullscreen'];
        return fullscreenFunc?.();
      } else {
        // try all browser variations (modern, old safari, old firefox, old IE)
        const exitFullscreenFunc =
          document?.exitFullscreen ??
          document?.['webkitExitFullscreen' as 'exitFullscreen'] ??
          document?.['mozExitFullScreen' as 'exitFullscreen'] ??
          document?.['msExitFullscreen' as 'exitFullscreen'];
        return exitFullscreenFunc?.();
      }
    }
  });
};
