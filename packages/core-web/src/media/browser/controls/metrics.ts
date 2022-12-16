import {
  MediaControllerStore,
  MediaMetrics,
  MetricsStatus,
  PlaybackMonitor,
  addMediaMetricsToStore,
} from '@livepeer/core/media';

const VIDEO_METRICS_INITIALIZED_ATTRIBUTE = 'data-metrics-initialized';

/**
 * Gather playback metrics from a generic HTML5 video/audio element and
 * report them to a websocket. Automatically handles a redirect to get the
 * metrics endpoint.
 *
 * @param element Element to capture playback metrics from
 */
export function addMediaMetricsToInitializedStore<
  TElement extends HTMLMediaElement,
>(
  store: MediaControllerStore<TElement> | undefined | null,
  sourceUrl: string | undefined | null,
  onError?: (error: unknown) => void,
): MediaMetrics<TElement> {
  const defaultResponse: MediaMetrics<TElement> = {
    metrics: null,
    destroy: () => {
      //
    },
  };

  if (!sourceUrl || !store) {
    return defaultResponse;
  }

  const element = store.getState()._element;

  if (!element) {
    return defaultResponse;
  }

  // do not attach twice (to the same websocket)
  if (element.hasAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE)) {
    return defaultResponse;
  }

  if (!('play' in element) || !('currentTime' in element)) {
    console.log('Element provided is not a media element');
    return defaultResponse;
  }

  element.setAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE, 'true');

  const { metrics } = addMediaMetricsToStore(store, sourceUrl, onError);

  const destroy = () => {
    element.removeAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE);
  };

  return { metrics, destroy };
}

export type { MediaMetrics, MetricsStatus, PlaybackMonitor };
