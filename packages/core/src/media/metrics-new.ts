import { warn } from "../utils";
import { MediaControllerStore } from "./controller";
import { getMetricsReportingPOSTUrl } from "./metrics-utils";
import { MimeType } from "./mime";

export type PlaybackEvent =
  | {
      type: "heartbeat";
      timestamp: number;
      errors: number;
      playtime_ms: number;
      ttff_ms?: number;
      preload_time_ms: number;
      autoplay_status: "autoplay" | "none";
      buffer_ms: number;
    }
  | {
      type: "error";
      timestamp: number;
      error_message: string;
    };

export type SessionData = {
  session_id: string;
  playback_id: string;
  protocol: MimeType | null;
  page_url: string;
  source_url: string;
  player: `${"audio" | "hls" | "video" | "webrtc" | "unknown"}-${string}`;
  user_agent: string;
  uid: string | null;
  events: PlaybackEvent[];
};

/**
 * Gather playback metrics from a media store and
 * POSTs them to an HTTP endpoint, which must be the same node as the playback
 * URL.
 *
 * @param store Store to capture playback metrics from.
 */
export function addMetricsToStore(
  store: MediaControllerStore | undefined | null,
  opts?: {
    interval?: number;
  },
): {
  destroy: () => void;
} {
  const defaultResponse = {
    destroy: () => {
      //
    },
  };

  if (!store) {
    return defaultResponse;
  }

  const interval = opts?.interval ?? 5000;

  const destroyFinalUrlListener = store.subscribe(
    (state) => ({
      finalUrl: state.currentUrl,
    }),
    async (state) => {
      if (state?.finalUrl) {
        const url = await getMetricsReportingPOSTUrl({
          playbackUrl: state.finalUrl,
        });

        if (url) {
          store.getState().__controlsFunctions.setMetricsReportingUrl(url);
        }
      }
    },
    {
      fireImmediately: true,
      equalityFn: (a, b) => {
        return a.finalUrl === b.finalUrl;
      },
    },
  );

  const timer = setInterval(async () => {
    const currentState = store.getState();
    const currentControlsState = currentState.__controls;
    const metricsUrl = currentState.metricsReportingUrl;

    if (metricsUrl) {
      if (!currentState.currentSource) {
        warn("Not sending metrics since no current playback source parsed.");
        return;
      }

      if (!currentControlsState.playbackId) {
        warn("Not sending metrics since no playback ID parsed.");
        return;
      }

      const abortController = new AbortController();

      const id = setTimeout(
        () => abortController.abort(),
        interval - 500, // we abort 500ms before the next request is scheduled
      );

      try {
        const windowHref =
          typeof window !== "undefined" ? window?.location?.href ?? "" : "";

        const pageUrl = isInIframe()
          ? typeof document !== "undefined"
            ? document?.referrer || windowHref
            : windowHref
          : windowHref;

        const playerPrefix = currentState?.currentSource?.type ?? "unknown";
        const version = currentState?.__device.version ?? "unknown";

        const sessionData: SessionData = {
          session_id: currentControlsState.sessionToken,
          playback_id: currentControlsState.playbackId,
          protocol: currentState.currentSource.mime,
          page_url: pageUrl,
          source_url: currentState.currentSource.src,
          player: `${
            playerPrefix === "audio"
              ? "audio"
              : playerPrefix === "hls"
                ? "hls"
                : playerPrefix === "video"
                  ? "video"
                  : playerPrefix === "webrtc"
                    ? "webrtc"
                    : "unknown"
          }-${version}`,
          user_agent: String(currentState?.__device?.userAgent ?? "").replace(
            /\\|"/gm,
            "",
          ),
          uid: currentState.__initialProps.viewerId,
          events: [],
        };

        const response = await fetch(metricsUrl, {
          method: "POST",
          mode: "cors",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(sessionData),
          signal: abortController.signal,
        });

        await response.text();

        if (response.ok) {
          // clear events that have been sent
        }
      } catch (e) {
        console.error(
          new Error(
            (e as Error)?.message ??
              "Error with metrics reporting, retrying...",
          ),
        );
      } finally {
        clearTimeout(id);
      }
    }
  }, interval);

  return {
    destroy: () => {
      if (timer) {
        clearInterval?.(timer);
      }
      destroyFinalUrlListener?.();
    },
  };
}

function isInIframe() {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch (e) {
    // if accessing window.top throws an exception due to cross-origin policy, the catch block will also return true,
    // indicating the code is running inside an iframe
    return true;
  }
}
