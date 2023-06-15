import {
  ControlsOptions,
  MediaMetrics,
  PlayerPropsOptions,
  createStorage,
  version,
} from '@livepeer/core';
import {
  addMediaMetricsToStore,
  createControllerStore,
} from '@livepeer/core/media';

import { addEventListeners, getDeviceInfo } from './controls';

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
export function addMediaMetrics<TElement extends HTMLMediaElement>(
  element: TElement | undefined | null,
  onError?: (error: unknown) => void,
  opts?: ControlsOptions & PlayerPropsOptions,
): MediaMetrics<TElement> {
  const store = createControllerStore<TElement>({
    element: element ?? undefined,
    device: getDeviceInfo(version.core),
    storage: createStorage(
      typeof window !== 'undefined'
        ? {
            storage: window.localStorage,
          }
        : {},
    ),
    playerProps: opts ?? {
      autoPlay: Boolean(element?.autoplay),
      muted: Boolean(element?.muted),
      priority: false,
    },
    opts: opts ?? {},
  });

  const { destroy: destroyListeners } = addEventListeners(store, opts);

  const { metrics, destroy: destroyMetrics } = addMediaMetricsToStore(
    store,
    onError,
  );

  return {
    metrics,
    destroy: () => {
      destroyListeners?.();
      destroyMetrics?.();
      store?.destroy?.();
    },
  };
}
