import {
  ControlsOptions as ControlsOptionsBase,
  DEFAULT_AUTOHIDE_TIME,
  MediaControllerState,
  MediaControllerStore,
} from "@livepeer/core/media";

import { StoreApi } from "zustand/vanilla";

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

  const onMouseEnter = () => {
    store.getState().__controlsFunctions.updateLastInteraction();
  };
  const onMouseLeave = () => {
    if (autohide) {
      // store.getState().__controlsFunctions.updateLastInteraction();
    }
  };
  const onMouseMove = async () => {
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

    if (parentElementOrElement) {
      if (hotkeys) {
        parentElementOrElement.addEventListener("keyup", onKeyUp);
        parentElementOrElement.setAttribute("tabindex", "0");
      }
      if (autohide) {
        parentElementOrElement.addEventListener("mouseenter", onMouseEnter);
        parentElementOrElement.addEventListener("mouseleave", onMouseLeave);
        parentElementOrElement.addEventListener("mousemove", onMouseMove);

        parentElementOrElement.addEventListener("touchstart", onTouchUpdate);
        parentElementOrElement.addEventListener("touchend", onTouchUpdate);
        parentElementOrElement.addEventListener("touchmove", onTouchUpdate);
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

    parentElementOrElement?.removeEventListener?.("keyup", onKeyUp);

    parentElementOrElement?.removeEventListener?.("mouseenter", onMouseEnter);
    parentElementOrElement?.removeEventListener?.("mouseleave", onMouseLeave);
    parentElementOrElement?.removeEventListener?.("mousemove", onMouseMove);

    parentElementOrElement?.addEventListener?.("touchstart", onTouchUpdate);
    parentElementOrElement?.addEventListener?.("touchend", onTouchUpdate);
    parentElementOrElement?.addEventListener?.("touchmove", onTouchUpdate);

    removeEffectsFromStore?.();

    element?.removeAttribute?.(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE);
  };

  return {
    destroy: () => {
      destroy?.();
    },
  };
};

let previousPromise:
  | Promise<void>
  // biome-ignore lint/suspicious/noExplicitAny: any
  | Promise<any>
  | Promise<null>
  | boolean
  | null;

const addEffectsToStore = (
  element: HTMLMediaElement,
  store: StoreApi<MediaControllerState>,
  options: Required<Pick<ControlsOptions, "autohide">>,
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

        if (
          current.__controls.requestedPlayPauseLastTime !==
          prev.__controls.requestedPlayPauseLastTime
        ) {
          if (element.paused) {
            previousPromise = element.play();
          } else {
            element.pause();
          }
        }

        if (current.playbackRate !== element.playbackRate) {
          element.playbackRate = current.playbackRate;
        }

        console.log({
          v: current.volume,
          muted: current.__controls.muted,
          vv: current.__controls.volume,
        });

        if (
          current.volume !== element.volume &&
          current.__device.isVolumeChangeSupported
        ) {
          element.volume = current.volume;
        }

        if (current.__controls.muted !== element.muted) {
          element.muted = current.__controls.muted;
        }

        if (
          !current.__controls.muted &&
          current.__controls.muted !== prev.__controls.muted &&
          current.__device.isVolumeChangeSupported
        ) {
          element.volume = current.__controls.volume;
        }

        if (
          current.__controls.requestedRangeToSeekTo !==
          prev.__controls.requestedRangeToSeekTo
        ) {
          // Can't set the time before the media is ready
          // Ignore if readyState isn't supported
          if (
            typeof element.readyState === "undefined" ||
            element.readyState > 0
          ) {
            element.currentTime = current.__controls.requestedRangeToSeekTo;
          }
        }

        // user has interacted with element
        if (
          options.autohide &&
          current.__controls.lastInteraction !== prev.__controls.lastInteraction
        ) {
          const { __device } = store.getState();
          if (!__device.isMobile) {
            store.getState().__controlsFunctions.setHidden(false);
          }

          await delay(options.autohide);

          if (
            !store.getState().hidden &&
            current.__controls.lastInteraction ===
              store.getState().__controls.lastInteraction
          ) {
            store.getState().__controlsFunctions.setHidden(true);
          }
        }

        if (
          current.__controls.requestedFullscreenLastTime !==
          prev.__controls.requestedFullscreenLastTime
        ) {
          const isFullscreen = isCurrentlyFullscreen(element);

          if (!isFullscreen) {
            previousPromise = enterFullscreen(element);
          } else {
            previousPromise = exitFullscreen(element);
          }
        }

        if (
          current.__controls.requestedPictureInPictureLastTime !==
          prev.__controls.requestedPictureInPictureLastTime
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
