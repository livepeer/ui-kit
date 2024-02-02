import {
  ControlsOptions as ControlsOptionsBase,
  DEFAULT_AUTOHIDE_TIME,
  MediaControllerStore,
} from "@livepeer/core/media";

import {
  ACCESS_CONTROL_ERROR_MESSAGE,
  BFRAMES_ERROR_MESSAGE,
  STREAM_OFFLINE_ERROR_MESSAGE,
} from "@livepeer/core/errors";
import { warn } from "@livepeer/core/utils";
import { HlsError, HlsVideoConfig, createNewHls } from "../../hls/hls";
import { createNewWHEP } from "../../webrtc/whep";
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
  /**
   * Configures the HLS.js options, for advanced usage of the Player.
   */
  hlsConfig?: Omit<HlsVideoConfig, "autoplay">;
};

export const addEventListeners = (
  element: HTMLMediaElement,
  store: MediaControllerStore,
  { autohide = DEFAULT_AUTOHIDE_TIME, hlsConfig = {} }: ControlsOptions = {},
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

  const onLoadedMetadata = () => {
    store.getState().__controlsFunctions.onCanPlay();
    store.getState().__controlsFunctions.requestMeasure();
  };

  const onLoadedData = () => {
    store.getState().__controlsFunctions.requestMeasure();
  };

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

    const isNotBroadcast =
      store.getState().__initialProps.hotkeys !== "broadcast";

    if (allKeyTriggers.includes(code)) {
      if ((code === "Space" || code === "KeyK") && isNotBroadcast) {
        store.getState().__controlsFunctions.togglePlay();
      } else if (code === "ArrowRight" && isNotBroadcast) {
        store.getState().__controlsFunctions.requestSeekForward();
      } else if (code === "ArrowLeft" && isNotBroadcast) {
        store.getState().__controlsFunctions.requestSeekBack();
      } else if (code === "KeyM" && isNotBroadcast) {
        store.getState().__controlsFunctions.requestToggleMute();
      } else if (code === "KeyX" && isNotBroadcast) {
        store.getState().__controlsFunctions.requestClip();
      } else if (code === "KeyF") {
        store.getState().__controlsFunctions.requestToggleFullscreen();
      } else if (code === "KeyI") {
        store.getState().__controlsFunctions.requestTogglePictureInPicture();
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
    const source = store.getState().currentSource;

    if (source?.type === "video") {
      const sourceElement = e.target;
      const parentElement = (sourceElement as HTMLSourceElement)?.parentElement;
      const videoUrl =
        (parentElement as HTMLVideoElement)?.currentSrc ??
        (sourceElement as HTMLVideoElement)?.currentSrc;

      if (videoUrl) {
        try {
          const response = await fetch(videoUrl);
          if (response.status === 404) {
            console.warn("Video not found");
            return store
              .getState()
              .__controlsFunctions?.onError?.(
                new Error(STREAM_OFFLINE_ERROR_MESSAGE),
              );
          }
          if (response.status === 401) {
            console.warn("Unauthorized to view video");
            return store
              .getState()
              .__controlsFunctions?.onError?.(
                new Error(ACCESS_CONTROL_ERROR_MESSAGE),
              );
          }
        } catch (err) {
          console.warn(err);
          return store
            .getState()
            .__controlsFunctions?.onError?.(
              new Error("Error fetching video URL"),
            );
        }
      }

      console.warn("Unknown error loading video");
      return store
        .getState()
        .__controlsFunctions?.onError?.(
          new Error("Unknown error loading video"),
        );
    }

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
    store.getState().__controlsFunctions.requestMeasure();
  };

  const parentElementOrElement = element?.parentElement ?? element;

  if (element) {
    element.addEventListener("volumechange", onVolumeChange);
    element.addEventListener("ratechange", onRateChange);

    element.addEventListener("loadedmetadata", onLoadedMetadata);
    element.addEventListener("loadeddata", onLoadedData);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    element.addEventListener("durationchange", onDurationChange);
    element.addEventListener("timeupdate", onTimeUpdate);
    element.addEventListener("error", onError);
    element.addEventListener("waiting", onWaiting);
    element.addEventListener("stalled", onStalled);
    element.addEventListener("loadstart", onLoadStart);
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

    if (typeof window !== "undefined") {
      window?.addEventListener?.("resize", onResize);
    }

    if (parentElementOrElement) {
      if (store.getState().__initialProps.hotkeys) {
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
    hlsConfig,
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

      element?.removeEventListener?.("ratechange", onRateChange);
      element?.removeEventListener?.("volumechange", onVolumeChange);
      element?.removeEventListener?.("loadedmetadata", onLoadedMetadata);
      element?.removeEventListener?.("loadeddata", onLoadedData);
      element?.removeEventListener?.("play", onPlay);
      element?.removeEventListener?.("pause", onPause);
      element?.removeEventListener?.("durationchange", onDurationChange);
      element?.removeEventListener?.("timeupdate", onTimeUpdate);
      element?.removeEventListener?.("error", onError);
      element?.removeEventListener?.("waiting", onWaiting);
      element?.removeEventListener?.("stalled", onStalled);
      element?.removeEventListener?.("loadstart", onLoadStart);
      element?.removeEventListener?.("ended", onEnded);

      if (typeof window !== "undefined") {
        window?.removeEventListener?.("resize", onResize);
      }

      if (autohide) {
        parentElementOrElement?.removeEventListener?.(
          "mouseover",
          onMouseUpdate,
        );
        parentElementOrElement?.removeEventListener?.(
          "mouseenter",
          onMouseUpdate,
        );
        parentElementOrElement?.removeEventListener?.(
          "mouseout",
          onMouseUpdate,
        );
        parentElementOrElement?.removeEventListener?.(
          "mousemove",
          onMouseUpdate,
        );

        parentElementOrElement?.removeEventListener?.(
          "touchstart",
          onTouchUpdate,
        );
        parentElementOrElement?.removeEventListener?.(
          "touchend",
          onTouchUpdate,
        );
        parentElementOrElement?.removeEventListener?.(
          "touchmove",
          onTouchUpdate,
        );
      }

      if (store.getState().__initialProps.hotkeys) {
        parentElementOrElement?.removeEventListener?.("keyup", onKeyUp);
      }

      removeEffectsFromStore?.();

      element?.removeAttribute?.(MEDIA_CONTROLLER_INITIALIZED_ATTRIBUTE);
    },
  };
};

type Cleanup = () => void | Promise<void>;

// Cleanup function for src side effects
let cleanupSource: Cleanup = () => {};
// Cleanup function for poster image side effects
let cleanupPosterImage: Cleanup = () => {};

const addEffectsToStore = (
  element: HTMLMediaElement,
  store: MediaControllerStore,
  options: ControlsOptions,
) => {
  // Subscribe to source changes (and trigger playback based on these)
  const destroySource = store.subscribe(
    ({
      __initialProps,
      currentSource,
      errorCount,
      live,
      progress,
      mounted,
      videoQuality,
    }) => ({
      accessKey: __initialProps.accessKey,
      aspectRatio: __initialProps.aspectRatio,
      autoPlay: __initialProps.autoPlay,
      errorCount,
      jwt: __initialProps.jwt,
      live,
      mounted,
      progress,
      source: currentSource,
      timeout: __initialProps.timeout,
      videoQuality,
    }),
    async ({
      accessKey,
      aspectRatio,
      autoPlay,
      errorCount,
      jwt,
      live,
      mounted,
      progress,
      source,
      timeout,
      videoQuality,
    }) => {
      if (!mounted) {
        return;
      }

      await cleanupSource?.();

      if (errorCount > 0) {
        const delayTime = 500 * 2 ** (errorCount - 1);
        await delay(delayTime);
      }

      let unmounted = false;

      if (!source) {
        return;
      }

      let jumped = false;

      const jumpToPreviousPosition = () => {
        if (!live && progress && !jumped) {
          element.currentTime = progress;

          jumped = true;
        }
      };

      const onErrorComposed = (err: Error) => {
        if (!unmounted) {
          store.getState().__controlsFunctions?.onError?.(err);
        }
      };

      if (source.type === "webrtc") {
        const unsubscribeBframes = store.subscribe(
          (state) => Boolean(state?.__metadata?.bframes),
          (bframes) => {
            if (bframes) {
              onErrorComposed(new Error(BFRAMES_ERROR_MESSAGE));
            }
          },
        );

        const { destroy } = createNewWHEP({
          source: source.src,
          element,
          callbacks: {
            onConnected: () => {
              store.getState().__controlsFunctions.setLive(true);
              jumpToPreviousPosition();
            },
            onError: onErrorComposed,
            onPlaybackOffsetUpdated:
              store.getState().__controlsFunctions.updatePlaybackOffsetMs,
            onRedirect: store.getState().__controlsFunctions.onFinalUrl,
          },
          accessControl: {
            jwt,
            accessKey,
          },
          sdpTimeout: timeout,
        });

        const id = setTimeout(() => {
          if (!store.getState().canPlay) {
            onErrorComposed(
              new Error(
                "Timeout reached for canPlay - triggering playback error.",
              ),
            );
          }
        }, timeout);

        cleanupSource = () => {
          clearTimeout(id);

          unmounted = true;
          unsubscribeBframes?.();
          destroy?.();
        };

        return;
      }

      if (source.type === "hls") {
        const indexUrl = /^https?:\/\/[^/\s]+\/hls\/[^/\s]+\/index\.m3u8/g;

        const onErrorCleaned = (error: HlsError) => {
          const cleanError = new Error(
            error?.response?.data?.toString?.() ??
              (error?.response?.code === 401
                ? ACCESS_CONTROL_ERROR_MESSAGE
                : "Error with HLS.js"),
          );

          onErrorComposed?.(cleanError);
        };

        const { destroy, setQuality } = createNewHls({
          source: source?.src,
          element,
          initialQuality: videoQuality,
          aspectRatio: aspectRatio ?? 16 / 9,
          callbacks: {
            onLive: store.getState().__controlsFunctions.setLive,
            onDuration: store.getState().__controlsFunctions.onDurationChange,
            onCanPlay: () => {
              store.getState().__controlsFunctions.onCanPlay();
              jumpToPreviousPosition();
            },
            onError: onErrorCleaned,
            onPlaybackOffsetUpdated:
              store.getState().__controlsFunctions.updatePlaybackOffsetMs,
            onRedirect: store.getState().__controlsFunctions.onFinalUrl,
          },
          config: {
            ...options?.hlsConfig,
            async xhrSetup(xhr, url) {
              await options?.hlsConfig?.xhrSetup?.(xhr, url);

              if (url.match(indexUrl)) {
                if (accessKey)
                  xhr.setRequestHeader("Livepeer-Access-Key", accessKey);
                else if (jwt) xhr.setRequestHeader("Livepeer-Jwt", jwt);
              }
            },
            autoPlay,
          },
        });

        const unsubscribeQualityUpdate = store.subscribe(
          (state) => state.videoQuality,
          (newQuality) => {
            setQuality(newQuality);
          },
        );

        cleanupSource = () => {
          unmounted = true;
          destroy?.();
          unsubscribeQualityUpdate?.();
        };

        return;
      }

      if (source?.type === "video") {
        store.getState().__controlsFunctions.onFinalUrl(source.src);

        element.addEventListener("canplay", jumpToPreviousPosition);

        element.src = source.src;
        element.load();

        cleanupSource = () => {
          unmounted = true;

          element?.removeEventListener?.("canplay", jumpToPreviousPosition);
        };

        return;
      }
    },
    {
      equalityFn: (a, b) =>
        a.errorCount === b.errorCount &&
        a.source?.src === b.source?.src &&
        a.mounted === b.mounted,
    },
  );

  // Subscribe to poster image changes
  const destroyPosterImage = store.subscribe(
    ({ __controls, live, __controlsFunctions, __initialProps }) => ({
      thumbnail: __controls.thumbnail?.src,
      live,
      setPoster: __controlsFunctions.setPoster,
      posterLiveUpdate: __initialProps.posterLiveUpdate,
    }),
    async ({ thumbnail, live, setPoster, posterLiveUpdate }) => {
      cleanupPosterImage?.();

      if (thumbnail && live) {
        const interval = setInterval(() => {
          const thumbnailUrl = new URL(thumbnail);

          thumbnailUrl.searchParams.set("v", Date.now().toFixed(0));

          setPoster(thumbnailUrl.toString());
        }, posterLiveUpdate);

        cleanupPosterImage = () => clearInterval(interval);
      }
    },
    {
      equalityFn: (a, b) => a.thumbnail === b.thumbnail && a.live === b.live,
    },
  );

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
      playing: state.playing,
      volume: state.volume,
      isVolumeChangeSupported: state.__device.isVolumeChangeSupported,
    }),
    (current) => {
      if (current.isVolumeChangeSupported) {
        element.volume = current.volume;
      }
    },
    {
      equalityFn: (a, b) =>
        a.volume === b.volume &&
        a.playing === b.playing &&
        a.isVolumeChangeSupported === b.isVolumeChangeSupported,
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
      try {
        const isPictureInPicture = await isCurrentlyPictureInPicture(element);
        if (isPictureInPicture) await exitPictureInPicture(element);
        else await enterPictureInPicture(element);
      } catch (e) {
        warn((e as Error)?.message ?? "Picture in picture is not supported");

        store.setState((state) => ({
          __device: {
            ...state.__device,
            isPictureInPictureSupported: false,
          },
        }));
      }
    },
  );

  // Subscribe to autohide interactions
  const destroyAutohide = store.subscribe(
    (state) => state.__controls.lastInteraction,
    async (lastInteraction) => {
      if (options.autohide && lastInteraction) {
        store.getState().__controlsFunctions.setHidden(false);

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

  // Subscribe to sizing requests
  const destroyRequestSizing = store.subscribe(
    (state) => ({
      lastTime: state.__controls.requestedMeasureLastTime,
      fullscreen: state.fullscreen,
    }),
    async () => {
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
        ...(typeof window !== "undefined" &&
        window?.innerHeight &&
        window?.innerWidth
          ? {
              window: {
                height: window.innerHeight,
                width: window.innerWidth,
              },
            }
          : {}),
      });
    },
    {
      equalityFn: (a, b) =>
        a?.fullscreen === b?.fullscreen && a?.lastTime === b?.lastTime,
    },
  );

  // Subscribe to media sizing changes
  const destroyMediaSizing = store.subscribe(
    (state) => state.__controls.size?.media,
    async (media) => {
      const parentElementOrElement = element?.parentElement ?? element;

      if (parentElementOrElement) {
        if (media?.height && media?.width) {
          const elementStyle = parentElementOrElement.style;
          elementStyle.setProperty(
            "--livepeer-media-height",
            `${media.height}px`,
          );
          elementStyle.setProperty(
            "--livepeer-media-width",
            `${media.width}px`,
          );
        }
      }
    },
    {
      equalityFn: (a, b) => a?.height === b?.height && a?.width === b?.width,
    },
  );

  // Subscribe to container sizing changes
  const destroyContainerSizing = store.subscribe(
    (state) => state.__controls.size?.container,
    async (container) => {
      const parentElementOrElement = element?.parentElement ?? element;

      if (parentElementOrElement) {
        if (container?.height && container?.width) {
          const elementStyle = parentElementOrElement.style;
          elementStyle.setProperty(
            "--livepeer-container-height",
            `${container.height}px`,
          );
          elementStyle.setProperty(
            "--livepeer-container-width",
            `${container.width}px`,
          );
        }
      }
    },
    {
      equalityFn: (a, b) => a?.height === b?.height && a?.width === b?.width,
    },
  );

  return () => {
    destroyAutohide?.();
    destroyContainerSizing?.();
    destroyFullscreen?.();
    destroyMediaSizing?.();
    destroyMute?.();
    destroyPictureInPicture?.();
    destroyPlaybackRate?.();
    destroyPlayPause?.();
    destroyPosterImage?.();
    destroyRequestSizing?.();
    destroySeeking?.();
    destroyVolume?.();
    destroySource?.();

    cleanupPosterImage?.();
    cleanupSource?.();
  };
};
