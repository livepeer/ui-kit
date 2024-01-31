import {
  MediaMetrics,
  addMediaMetricsToStore,
  createControllerStore,
} from "@livepeer/core/media";
import { createStorage } from "@livepeer/core/storage";
import { version } from "@livepeer/core/version";
import { addEventListeners, getDeviceInfo } from "./controls";

/**
 * Gather playback metrics from a generic HTML5 video/audio element and
 * report them to a websocket. Automatically handles a redirect to get the
 * metrics endpoint.
 *
 * @param element Element to capture playback metrics from.
 * @param sourceUrl Source URL for the player.
 * @param onError Callback when an error with metrics occurs.
 * @param opts Options for the metrics reporting.
 * @returns A callback for destroying the store and metrics.
 */
export function addMediaMetrics(
  element: HTMLMediaElement | undefined | null,
  onError?: (error: unknown) => void,
): MediaMetrics {
  if (element) {
    const { store, destroy } = createControllerStore({
      src: element?.src ?? null,
      device: getDeviceInfo(version.core),
      storage: createStorage(
        typeof window !== "undefined"
          ? {
              storage: window.localStorage,
            }
          : {},
      ),
      initialProps: {
        autoPlay: Boolean(element?.autoplay),
        volume: element?.muted ? 0 : element?.volume,
        preload: element?.preload === "" ? "auto" : element?.preload,
        viewerId: null,
        playbackRate: element?.playbackRate,
        onError,
      },
    });

    const { destroy: destroyListeners } = addEventListeners(element, store);

    const { metrics, destroy: destroyMetrics } = addMediaMetricsToStore(store);

    return {
      metrics,
      destroy: () => {
        destroy?.();
        destroyListeners?.();
        destroyMetrics?.();
      },
    };
  }

  return {
    metrics: null,
    destroy: () => {},
  };
}
