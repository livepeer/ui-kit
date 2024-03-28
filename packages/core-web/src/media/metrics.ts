import {
  type InitialProps,
  addLegacyMediaMetricsToStore,
  addMetricsToStore,
  createControllerStore,
} from "@livepeer/core/media";
import { createStorage, noopStorage } from "@livepeer/core/storage";
import { version } from "@livepeer/core/version";
import { addEventListeners, getDeviceInfo } from "./controls";

export type MediaMetricsOptions = Pick<InitialProps, "onError" | "viewerId"> & {
  /**
   * Sets a custom source URL for playback, such as `https://livepeercdn.studio/hls/{playbackId}/index.m3u8`.
   * If not specified, the function defaults to using the `src` attribute of the HTMLMediaElement.
   * Note: For custom players that do not set the `src` attribute of the `video` element, opting instead for formats like `blob:<src>` or omitting `src` altogether, metrics collection may not function correctly.
   */
  src?: string;

  /**
   * Sets a custom playback ID for playback.
   * If not specified, the function defaults to parsing the `src` attribute of the HTMLMediaElement to get the playback ID.
   */
  playbackId?: string;

  /**
   * Disables the `progress` event listener, which is used to monitor when media is in a "playing" state.
   */
  disableProgressListener?: boolean;

  /**
   * The interval at which metrics are sent via HTTP, in ms. Default 5000.
   */
  interval?: number;
};

/**
 * Initializes media playback metrics collection for a video or audio element.
 * This adds event listeners to the media element with a store that updates on events and send them to a websocket.
 * Returns a `destroy` function which must be called when the video element is removed from the DOM.
 *
 * @param {HTMLMediaElement | undefined | null} element The media element from which to capture playback metrics.
 * @param {Partial<MediaMetricsOptions>} opts Optional configuration options including:
 *   - `src`: Overrides the `src` URL for playback - defaults to the `src` attribute of the HTMLMediaElement. Use this with custom players that do not set the `src` attribute of the `video` element.
 *   - `playbackId`: Overrides the `playbackId` - defaults to parsing from the `src` attribute of the HTMLMediaElement. Use this with custom players that do not have a valid src URL which contains a playback ID.
 *   - `onError`: A callback function that is called when an error occurs in the metrics collection process.
 *   - `viewerId`: An identifier for the viewer to associate metrics with a specific user or session.
 *
 * @returns An object containing a `destroy` function to clean up resources.
 * The `destroy` function must be used to remove event listeners and perform other cleanup actions on unmount.
 */
export function addMediaMetrics(
  element: HTMLMediaElement | undefined | null,
  opts: Partial<MediaMetricsOptions> = {},
) {
  if (element) {
    const source = opts?.src ?? element?.src ?? null;
    const { store, destroy } = createControllerStore({
      src: source,
      playbackId: opts?.playbackId,
      device: getDeviceInfo(version.core),
      storage: createStorage({ storage: noopStorage }),
      initialProps: {
        autoPlay: Boolean(element?.autoplay),
        volume: element?.muted ? 0 : element?.volume,
        preload: element?.preload === "" ? "auto" : element?.preload,
        playbackRate: element?.playbackRate,
        hotkeys: false,
        posterLiveUpdate: 0,
        ...opts,
      },
    });

    const { destroy: destroyListeners } = addEventListeners(element, store);

    const { destroy: destroyMetrics } = addMetricsToStore(store, {
      disableProgressListener: opts.disableProgressListener,
      interval: opts.interval,
    });
    const { destroy: destroyLegacyMetrics, metrics: legacyMetrics } =
      addLegacyMediaMetricsToStore(store, {
        disableProgressListener: opts.disableProgressListener,
      });

    store
      .getState()
      .__controlsFunctions.onFinalUrl(
        source ?? "https://vod-cdn.lp-playback.studio",
      );

    return {
      /** @deprecated */
      legacyMetrics,
      destroy: () => {
        destroy?.();
        destroyListeners?.();
        destroyMetrics?.();
        destroyLegacyMetrics?.();
      },
    };
  }

  return {
    destroy: () => {},
  };
}
