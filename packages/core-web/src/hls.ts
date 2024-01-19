import Hls, { ErrorData, HlsConfig } from "hls.js";

import { isClient } from "./media/utils";

export const VIDEO_HLS_INITIALIZED_ATTRIBUTE =
  "data-livepeer-player-video-hls-initialized";

export type HlsError = ErrorData;

export type VideoConfig = { autoplay?: boolean };
export type HlsVideoConfig = Partial<HlsConfig> & {
  autoplay?: boolean;
  currentTime?: number;
};

/**
 * Checks if hls.js can play in the browser.
 */
export const isHlsSupported = () => (isClient() ? Hls.isSupported() : true);

/**
 * Create an hls.js instance and attach to the provided media element.
 */
export const createNewHls = <TElement extends HTMLMediaElement>(
  source: string,
  element: TElement,
  callbacks?: {
    onLive?: (v: boolean) => void;
    onPlaybackOffsetUpdated?: (d: number) => void;
    onDuration?: (v: number) => void;
    onCanPlay?: () => void;
    onError?: (data: HlsError) => void;
    onRedirect?: (url: string | null) => void;
  },
  config?: HlsVideoConfig,
): {
  destroy: () => void;
} => {
  // do not attach twice
  if (element.getAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE) === "true") {
    return {
      destroy: () => {
        //
      },
    };
  }

  element.setAttribute(VIDEO_HLS_INITIALIZED_ATTRIBUTE, "true");

  const hls = new Hls({
    backBufferLength: 60 * 1.5,
    ...config,
    ...(config?.liveSyncDurationCount
      ? {
          liveSyncDurationCount: config.liveSyncDurationCount,
        }
      : {
          liveMaxLatencyDurationCount: 7,
          liveSyncDurationCount: 3,
        }),
  });

  const onDestroy = () => {
    hls?.destroy?.();
    element?.removeAttribute?.(VIDEO_HLS_INITIALIZED_ATTRIBUTE);
  };

  if (element) {
    hls.attachMedia(element);
  }

  let redirected = false;

  hls.on(Hls.Events.LEVEL_LOADED, async (_e, data) => {
    const { live, totalduration: duration, url } = data.details;

    if (!redirected) {
      callbacks?.onRedirect?.(url ?? null);
      redirected = true;
    }

    callbacks?.onLive?.(Boolean(live));
    callbacks?.onDuration?.(duration ?? 0);
  });

  hls.on(Hls.Events.MEDIA_ATTACHED, async () => {
    hls.loadSource(source);

    hls.on(Hls.Events.MANIFEST_PARSED, (_event, _data) => {
      if (config.currentTime) element.currentTime = config.currentTime;
      callbacks?.onCanPlay?.();
    });
  });

  hls.on(Hls.Events.ERROR, async (_event, data) => {
    const { details, fatal } = data;

    const isManifestParsingError =
      Hls.ErrorTypes.NETWORK_ERROR && details === "manifestParsingError";

    if (!fatal && !isManifestParsingError) return;
    callbacks?.onError?.(data);

    if (fatal) {
      console.error(`Fatal error : ${data.details}`);
      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.error(`A network error occurred: ${data.details}`);
          break;
        default:
          console.error(`An unrecoverable error occurred: ${data.details}`);
          hls.destroy();
          break;
      }
    }
  });

  function updateOffset() {
    const currentDate = Date.now();
    const newDate = hls.playingDate;

    if (newDate && currentDate) {
      callbacks?.onPlaybackOffsetUpdated?.(currentDate - newDate.getTime());
    }
  }

  const updateOffsetInterval = setInterval(updateOffset, 2000);

  return {
    destroy: () => {
      onDestroy?.();
      clearInterval?.(updateOffsetInterval);
    },
  };
};
