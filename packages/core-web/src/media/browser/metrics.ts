import {
  ControlsOptions,
  MediaMetrics,
  PlayerPropsOptions,
  createStorage,
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
): MediaMetrics {
  const store = createControllerStore<TElement>({
    element: element ?? null,
    device: getDeviceInfo(),
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
      preload:
        element?.preload || Boolean(element?.autoplay) ? 'full' : 'metadata',
    },
    opts: opts ?? {},
  });

  const { destroy: destroyListeners } = addEventListeners(store, opts);

  const { destroy: destroyMetrics } = addMediaMetricsToStore(store, onError);

  return {
    destroy: () => {
      destroyListeners?.();
      destroyMetrics?.();
      store?.destroy?.();
    },
  };
}
