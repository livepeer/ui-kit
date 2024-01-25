import {
  ControlsOptions as ControlsOptionsBase,
  DEFAULT_AUTOHIDE_TIME,
  MediaControllerStore,
} from "@livepeer/core/media";

import {
  addFullscreenEventListener,
  enterFullscreen,
  exitFullscreen,
  isCurrentlyFullscreen,
} from "./fullscreen";
import {
  addEnterPictureInPictureEventListener,
  addExitPictureInPictureEventListener,
  enterPictureInPicture,
  exitPictureInPicture,
  isCurrentlyPictureInPicture,
} from "./pictureInPicture";
import { isVolumeChangeSupported } from "./volume";

const MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE =
  "data-livepeer-controller-initialized";

const allKeyTriggers = [
  "KeyF",
  "KeyK",
  "KeyM",
  "KeyI",
  "KeyV",
  "KeyX",
  "Space",
  "ArrowRight",
  "ArrowLeft",
] as const;
type KeyTrigger = (typeof allKeyTriggers)[number];

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export type ControlsOptions = ControlsOptionsBase & {
  /** If hotkeys should be enabled on the media element (arrows to seek, etc) */
  hotkeys?: boolean;
};

export const addEventListeners = (
  element: HTMLMediaElement,
  store: MediaControllerStore,
  { hotkeys = true, autohide = DEFAULT_AUTOHIDE_TIME }: ControlsOptions = {},
) => {
  const initializedState = store.getState();

  try {
    isVolumeChangeSupported(
      initializedState.currentSource?.type === "audio" ? "audio" : "video",
    ).then((result) => {
      store.setState(({ __device }) => ({
        __device: {
          ...__device,
          isVolumeChangeSupported: result,
        },
      }));
    });
  } catch (e) {
    console.error(e);
  }

  const onLoadedMetadata = () =>
    store.getState().__controlsFunctions.onCanPlay();

  const onPlay = () => {
    store.getState().__controlsFunctions.onPlay();
  };
  const onPause = () => {
    store.getState().__controlsFunctions.onPause();
  };

  const onDurationChange = () =>
    store
      .getState()
      .__controlsFunctions.onDurationChange(element?.duration ?? 0);

  const onKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const code = e.code as KeyTrigger;

    store.getState().__controlsFunctions.updateLastInteraction();

    if (allKeyTriggers.includes(code)) {
      if (code === "Space" || code === "KeyK") {
        store.getState().__controlsFunctions.togglePlay();
      } else if (code === "KeyF") {
        store.getState().__controlsFunctions.requestToggleFullscreen();
      } else if (code === "KeyI") {
        store.getState().__controlsFunctions.requestTogglePictureInPicture();
      } else if (code === "ArrowRight") {
        store.getState().__controlsFunctions.requestSeekForward();
      } else if (code === "ArrowLeft") {
        store.getState().__controlsFunctions.requestSeekBack();
      } else if (code === "KeyM") {
        store.getState().__controlsFunctions.requestToggleMute();
      } else if (code === "KeyX") {
        store.getState().__controlsFunctions.requestClip();
      }
    }
  };

  const onMouseUpdate = () => {
    store.getState().__controlsFunctions.updateLastInteraction();
  };
  const onTouchUpdate = async () => {
    store.getState().__controlsFunctions.updateLastInteraction();
  };

  const onVolumeChange = () => {
    store
      .getState()
      .__controlsFunctions.setVolume(element.muted ? 0 : element.volume ?? 0);
  };

  const onRateChange = () => {
    store.getState().__controlsFunctions.setPlaybackRate(element.playbackRate);
  };

  const onTimeUpdate = () => {
    store.getState().__controlsFunctions.onProgress(element?.currentTime ?? 0);

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
        // default to no buffering
        0,
      );

      store.getState().__controlsFunctions.updateBuffered(buffered);
    }
  };

  const onError = async (e: ErrorEvent) => {
    store.getState().__controlsFunctions.onError(new Error(e?.message));
  };

  const onWaiting = async () => {
    store.getState().__controlsFunctions.onWaiting();
  };

  const onStalled = async () => {
    store.getState().__controlsFunctions.onStalled();
  };

  const onLoadStart = async () => {
    store.getState().__controlsFunctions.onLoading();
  };

  const onEnded = async () => {
    store.getState().__controlsFunctions.onEnded();
  };

  const onResize = async () => {
    store.getState().__controlsFunctions.setSize({
      ...((element as unknown as HTMLVideoElement)?.videoHeight &&
      (element as unknown as HTMLVideoElement)?.videoWidth
        ? {
            media: {
              height: (element as unknown as HTMLVideoElement).videoHeight,
              width: (element as unknown as HTMLVideoElement).videoWidth,
            },
          }
        : {}),
      ...(element?.clientHeight && element?.clientWidth
        ? {
            container: {
              height: element.clientHeight,
              width: element.clientWidth,
            },
          }
        : {}),
    });
  };

  if (element) {
    onResize();
  }

  const parentElementOrElement = element?.parentElement ?? element;

  if (element) {
    element.addEventListener("volumechange", onVolumeChange);
    element.addEventListener("ratechange", onRateChange);

    element.addEventListener("loadedmetadata", onLoadedMetadata);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    element.addEventListener("durationchange", onDurationChange);
    element.addEventListener("timeupdate", onTimeUpdate);
    element.addEventListener("error", onError);
    element.addEventListener("waiting", onWaiting);
    element.addEventListener("stalled", onStalled);
    element.addEventListener("loadstart", onLoadStart);
    element.addEventListener("resize", onResize);
    element.addEventListener("ended", onEnded);

    if (autohide) {
      parentElementOrElement.addEventListener("mouseover", onMouseUpdate);
      parentElementOrElement.addEventListener("mouseenter", onMouseUpdate);
      parentElementOrElement.addEventListener("mouseout", onMouseUpdate);
      parentElementOrElement.addEventListener("mousemove", onMouseUpdate);

      parentElementOrElement.addEventListener("touchstart", onTouchUpdate);
      parentElementOrElement.addEventListener("touchend", onTouchUpdate);
      parentElementOrElement.addEventListener("touchmove", onTouchUpdate);
    }

    if (parentElementOrElement) {
      if (hotkeys) {
        parentElementOrElement.addEventListener("keyup", onKeyUp);
        parentElementOrElement.setAttribute("tabindex", "0");
      }
    }

    element.load();

    element.setAttribute(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE, "true");
  }

  const onFullscreenChange = () => {
    store
      .getState()
      .__controlsFunctions.setFullscreen(isCurrentlyFullscreen(element));
  };

  const onEnterPictureInPicture = () => {
    store.getState().__controlsFunctions.setPictureInPicture(true);
  };
  const onExitPictureInPicture = () => {
    store.getState().__controlsFunctions.setPictureInPicture(false);
  };

  // add effects
  const removeEffectsFromStore = addEffectsToStore(element, store, {
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

  const destroy = () => {
    removeFullscreenListener?.();

    removeEnterPictureInPictureListener?.();
    removeExitPictureInPictureListener?.();

    element?.removeEventListener?.("ratechange", onRateChange);
    element?.removeEventListener?.("volumechange", onVolumeChange);
    element?.removeEventListener?.("loadedmetadata", onLoadedMetadata);
    element?.removeEventListener?.("play", onPlay);
    element?.removeEventListener?.("pause", onPause);
    element?.removeEventListener?.("durationchange", onDurationChange);
    element?.removeEventListener?.("timeupdate", onTimeUpdate);
    element?.removeEventListener?.("error", onError);
    element?.removeEventListener?.("waiting", onWaiting);
    element?.removeEventListener?.("stalled", onStalled);
    element?.removeEventListener?.("loadstart", onLoadStart);
    element?.removeEventListener?.("resize", onResize);
    element?.removeEventListener?.("ended", onEnded);

    parentElementOrElement?.removeEventListener?.("mouseover", onMouseUpdate);
    parentElementOrElement?.removeEventListener?.("mouseenter", onMouseUpdate);
    parentElementOrElement?.removeEventListener?.("mouseout", onMouseUpdate);
    parentElementOrElement?.removeEventListener?.("mousemove", onMouseUpdate);

    parentElementOrElement?.removeEventListener?.("touchstart", onTouchUpdate);
    parentElementOrElement?.removeEventListener?.("touchend", onTouchUpdate);
    parentElementOrElement?.removeEventListener?.("touchmove", onTouchUpdate);

    parentElementOrElement?.removeEventListener?.("keyup", onKeyUp);

    removeEffectsFromStore?.();

    element?.removeAttribute?.(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE);
  };

  return {
    destroy: () => {
      destroy?.();
    },
  };
};

const addEffectsToStore = (
  element: HTMLMediaElement,
  store: MediaControllerStore,
  options: Required<Pick<ControlsOptions, "autohide">>,
) => {
  // Subscribe to play/pause changes
  const destroyPlayPause = store.subscribe(
    (state) => state.__controls.requestedPlayPauseLastTime,
    async () => {
      if (element.paused) {
        await element.play();
      } else {
        await element.pause();
      }
    },
  );

  // Subscribe to playback rate changes
  const destroyPlaybackRate = store.subscribe(
    (state) => state.playbackRate,
    (current) => {
      element.playbackRate = current === "constant" ? 1 : current;
    },
  );

  // Subscribe to volume changes
  const destroyVolume = store.subscribe(
    (state) => ({
      volume: state.volume,
      isVolumeChangeSupported: state.__device.isVolumeChangeSupported,
    }),
    (current) => {
      if (current.isVolumeChangeSupported) {
        element.volume = current.volume;
      }
    },
  );

  // Subscribe to mute changes
  const destroyMute = store.subscribe(
    (state) => state.__controls.muted,
    (current, prev) => {
      if (current !== prev) {
        element.muted = current;
      }
    },
  );

  // Subscribe to seeking changes
  const destroySeeking = store.subscribe(
    (state) => state.__controls.requestedRangeToSeekTo,
    (current) => {
      if (typeof element.readyState === "undefined" || element.readyState > 0) {
        element.currentTime = current;
      }
    },
  );

  // Subscribe to fullscreen changes
  const destroyFullscreen = store.subscribe(
    (state) => state.__controls.requestedFullscreenLastTime,
    async () => {
      const isFullscreen = isCurrentlyFullscreen(element);
      if (isFullscreen) exitFullscreen(element);
      else enterFullscreen(element);
    },
  );

  // Subscribe to picture-in-picture changes
  const destroyPictureInPicture = store.subscribe(
    (state) => state.__controls.requestedPictureInPictureLastTime,
    async () => {
      const isPictureInPicture = isCurrentlyPictureInPicture(element);
      if (isPictureInPicture) exitPictureInPicture(element);
      else enterPictureInPicture(element);
    },
  );

  // Subscribe to autohide interactions
  const destroyAutohide = store.subscribe(
    (state) => state.__controls.lastInteraction,
    async (lastInteraction) => {
      if (options.autohide && lastInteraction) {
        const { __device } = store.getState();
        if (!__device.isMobile) {
          store.getState().__controlsFunctions.setHidden(false);
        }

        await delay(options.autohide);

        if (
          !store.getState().hidden &&
          lastInteraction === store.getState().__controls.lastInteraction
        ) {
          store.getState().__controlsFunctions.setHidden(true);
        }
      }
    },
  );

  return () => {
    destroyAutohide?.();
    destroyFullscreen?.();
    destroyMute?.();
    destroyPictureInPicture?.();
    destroyPlaybackRate?.();
    destroyPlayPause?.();
    destroySeeking?.();
    destroyVolume?.();
  };
};
