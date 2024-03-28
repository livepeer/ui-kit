import type { MediaControllerStore } from "./controller";
import { getMetricsReportingWebsocketUrl } from "./metrics-utils";
import type { MimeType } from "./mime";

type MetricsOpts = {
  /**
   * Disables the `progress` event listener, which is used to monitor when media is in a "playing" state.
   */
  disableProgressListener?: boolean;
};

type RawMetrics = {
  preloadTime: number | null;
  ttff: number | null;
  firstPlayback: number | null;

  nWaiting: number | null;
  timeWaiting: number;

  nStalled: number | null;
  timeStalled: number;

  timeUnpaused: number;

  nError: number | null;
  lastError?: string;

  videoHeight: number | null;
  videoWidth: number | null;
  playerHeight: number | null;
  playerWidth: number | null;

  playbackScore: number | null;

  player: `${
    | "audio"
    | "hls"
    | "video"
    | "webrtc"
    | "image"
    | "vtt"
    | "unknown"}-${string}`;

  sourceType: MimeType | "unknown";

  offset: number | null;

  pageUrl: string;
  sourceUrl: string | null;
  duration: number | null;

  autoplay: "autoplay" | "preload-full" | "preload-metadata" | "standard";
  userAgent: string;

  uid: string;
};

type PlaybackRecord = {
  clockTime: number;
  mediaTime: number;
  score: number;
};

/**
 * @deprecated in favor of `addMetricsToStore`
 */
export class LegacyPlaybackMonitor {
  active = false;
  values: PlaybackRecord[] = [];
  score: number | null = null;
  averagingSteps = 20;
  store: MediaControllerStore;

  constructor(store: MediaControllerStore) {
    this.store = store;
  }

  init() {
    if (!this.active) {
      this.values = [];
      this.score = null;

      this.active = true;
    }
  }
  reset() {
    if (!this.active) {
      // it's not running, start it up
      this.init();
    } else {
      this.values = [];
    }
  }
  destroy() {
    if (this.active) {
      this.values = [];
      this.score = null;
      this.active = false;
    }
  }

  calculateScore() {
    if (this.active) {
      // save the current testing value and time
      // If the media plays, this should keep a constant value. If the media is stalled, it will go up with 1sec/sec. If the media is playing faster, it will go down.
      // current clock time - current playback time
      const latestPlaybackRecord =
        this.values.length > 0
          ? this.values[this.values.length - 1]
          : undefined;

      const currentValue = {
        clockTime: Date.now() * 1e-3,
        mediaTime: this.store.getState().progress,
        score: latestPlaybackRecord
          ? this.valueToScore(latestPlaybackRecord)
          : 0,
      };

      this.values.push(currentValue); // add the current value to the history

      // no history yet, can't calculate a score
      if (this.values.length < 2) {
        return null;
      }

      const oldestValue = this.values[0];

      if (oldestValue !== undefined) {
        // diff between oldest score and current
        const averagedScore = this.valueToScore(oldestValue, currentValue); // should be 1, decreases if bad

        // kick the oldest value from the array
        if (this.values.length > this.averagingSteps) {
          this.values.shift();
        }

        // the final score is the maximum of the averaged and the current value
        this.score = Math.max(averagedScore, currentValue.score);

        return Math.round(this.score * 10) / 10;
      }
    }

    return null;
  }

  valueToScore(a: PlaybackRecord, b?: PlaybackRecord) {
    // calculate the moving average
    // if this returns > 1, the media played faster than the clock
    // if this returns < 0, the media time went backwards
    const rate = this?.store?.getState?.()?.playbackRate ?? 1;

    return (
      (b?.mediaTime ?? this.store.getState().progress - a.mediaTime) /
      (b?.clockTime ?? Date.now() * 1e-3 - a.clockTime) /
      (rate === "constant" ? 1 : rate)
    );
  }
}

class Timer {
  totalTime = 0;

  countStarts = 0;
  startTime = 0;

  start() {
    this.startTime = Date.now();
    this.countStarts++;
  }
  stop() {
    this.totalTime += this.startTime > 0 ? Date.now() - this.startTime : 0;
    this.startTime = 0;
  }
  getTotalTime() {
    this.totalTime += this.startTime > 0 ? Date.now() - this.startTime : 0;
    this.startTime = this.startTime > 0 ? Date.now() : 0;

    return this.totalTime;
  }
  getCountStarts() {
    return this.countStarts;
  }
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

/**
 * @deprecated in favor of `addMetricsToStore`
 */
export class LegacyMetricsStatus {
  requestedPlayTime: number | null = null;
  firstFrameTime: number | null = null;

  retryCount = 0;
  connected = false;
  store: MediaControllerStore;

  destroy: () => void;

  currentMetrics: RawMetrics;
  previousMetrics: RawMetrics | null = null;

  timeWaiting = new Timer();
  timeStalled = new Timer();
  timeUnpaused = new Timer();

  constructor(store: MediaControllerStore, opts: MetricsOpts | undefined) {
    const currentState = store.getState();

    this.store = store;

    const windowHref =
      typeof window !== "undefined" ? window?.location?.href ?? "" : "";

    const pageUrl = isInIframe()
      ? typeof document !== "undefined"
        ? document?.referrer || windowHref
        : windowHref
      : windowHref;

    const playerPrefix = currentState?.currentSource?.type ?? "unknown";
    const version = currentState?.__device.version ?? "unknown";

    this.currentMetrics = {
      autoplay: currentState.__initialProps.autoPlay
        ? "autoplay"
        : currentState.__initialProps.preload === "auto"
          ? "preload-full"
          : currentState.__initialProps.preload === "metadata"
            ? "preload-metadata"
            : "standard",
      duration: null,
      firstPlayback: null,
      nError: null,
      nStalled: null,
      nWaiting: null,
      offset: null,
      pageUrl,
      playbackScore: null,
      player: `${playerPrefix}-${version}`,
      sourceType: currentState?.currentSource?.mime ?? "unknown",
      sourceUrl: currentState?.currentSource?.src ?? null,
      playerHeight: null,
      playerWidth: null,
      preloadTime: null,
      timeStalled: 0,
      timeUnpaused: 0,
      timeWaiting: 0,
      ttff: null,
      uid: currentState.__initialProps.viewerId ?? "",
      userAgent: String(currentState?.__device?.userAgent ?? "").replace(
        /\\|"/gm,
        "",
      ),
      videoHeight: null,
      videoWidth: null,
    };

    this.destroy = store.subscribe((state, prevState) => {
      if (
        this.requestedPlayTime === null &&
        state.__controls.playLastTime !== 0
      ) {
        this.requestedPlayTime = Math.max(
          state.__controls.playLastTime - bootMs,
          0,
        );
      }

      if (state.currentSource?.src !== prevState.currentSource?.src) {
        const playerPrefix = state?.currentSource?.type ?? "unknown";
        const version = state?.__device.version ?? "unknown";

        this.currentMetrics.player = `${playerPrefix}-${version}`;
        this.currentMetrics.sourceType = state.currentSource?.mime ?? "unknown";
        this.currentMetrics.sourceUrl = state.currentSource?.src ?? null;
      }

      if (state.playing !== prevState.playing) {
        if (state.playing) {
          this.timeStalled.stop();
          this.timeWaiting.stop();

          this.timeUnpaused.start();
        } else {
          this.timeUnpaused.stop();
        }
      }

      if (
        opts?.disableProgressListener !== true &&
        state.progress !== prevState.progress &&
        !this.timeUnpaused.startTime
      ) {
        this.timeStalled.stop();
        this.timeWaiting.stop();
        this.timeUnpaused.start();
      }

      if (state.stalled !== prevState.stalled && state.stalled) {
        this.timeStalled.start();
        this.timeUnpaused.stop();
      }
      if (state.waiting !== prevState.waiting && state.waiting) {
        this.timeWaiting.start();
        this.timeUnpaused.stop();
      }
    });
  }

  addError(error: string) {
    this.currentMetrics.nError = (this.currentMetrics.nError ?? 0) + 1;
    this.currentMetrics.lastError = error;
  }

  getFirstPlayback() {
    return this.currentMetrics.firstPlayback;
  }
  setFirstPlayback() {
    this.currentMetrics.firstPlayback = Date.now() - bootMs;
  }
  getFirstFrameTime() {
    return this.firstFrameTime;
  }
  setFirstFrameTime() {
    this.firstFrameTime = Date.now() - bootMs;
  }
  setPlaybackScore(playbackScore: number) {
    this.currentMetrics.playbackScore = playbackScore;
  }
  setConnected(isConnected: boolean) {
    this.connected = isConnected;
  }

  getMetrics() {
    const currentMetrics: RawMetrics = {
      ...this.currentMetrics,
      playerHeight:
        this.store.getState().__controls.size?.container?.height || null,
      playerWidth:
        this.store.getState().__controls.size?.container?.width || null,
      videoWidth: this.store.getState().__controls.size?.media?.width || null,
      videoHeight: this.store.getState().__controls.size?.media?.height || null,
      duration: this.store.getState().duration || null,

      nWaiting: this.timeWaiting.getCountStarts(),
      nStalled: this.timeStalled.getCountStarts(),

      timeWaiting: this.timeWaiting.getTotalTime(),
      timeStalled: this.timeStalled.getTotalTime(),
      timeUnpaused: this.timeUnpaused.getTotalTime(),

      offset: this.store.getState().__controls.playbackOffsetMs || null,

      // this is the amount of time that a video has had to preload content, from boot until play was requested
      preloadTime: this.requestedPlayTime,
      // time from when the first `play` event is emitted and the first progress update
      ttff:
        this.firstFrameTime &&
        this.requestedPlayTime &&
        this.firstFrameTime > 0 &&
        this.requestedPlayTime > 0
          ? Math.max(this.firstFrameTime - this.requestedPlayTime, 0)
          : null,
    };

    const previousMetrics = this.previousMetrics;
    this.previousMetrics = currentMetrics;

    return {
      current: currentMetrics,
      previous: previousMetrics,
    };
  }
}

const bootMs = Date.now(); // used for firstPlayback value

/**
 * @deprecated in favor of `addMetricsToStore`
 */
export type LegacyMediaMetrics = {
  metrics: LegacyMetricsStatus | null;
  destroy: () => void;
};

/**
 * Gather playback metrics from a media store and
 * report them to a websocket. Automatically handles a redirect to get the
 * metrics endpoint.
 *
 * @param store Element to capture playback metrics from
 * @deprecated in favor of `addMetricsToStore`
 */
export function addLegacyMediaMetricsToStore(
  store: MediaControllerStore | undefined | null,
  opts?: MetricsOpts,
): LegacyMediaMetrics {
  const defaultResponse: LegacyMediaMetrics = {
    metrics: null,
    destroy: () => {
      //
    },
  };

  if (!store) {
    return defaultResponse;
  }

  if (!WebSocket) {
    console.log("Environment does not support WebSocket");
    return defaultResponse;
  }

  let websocketPromise: Promise<WebSocket | null> | null = null;

  let timeOut: NodeJS.Timeout | null = null;
  let enabled = true;

  const metricsStatus = new LegacyMetricsStatus(store, opts);
  const monitor = new LegacyPlaybackMonitor(store);

  const report = async () => {
    const ws = await websocketPromise;

    if (!enabled || !ws) {
      return;
    }

    // update playback score from monitor
    const playbackScore = monitor.calculateScore();
    if (playbackScore !== null) {
      metricsStatus.setPlaybackScore(playbackScore);
    }

    const metrics = metricsStatus.getMetrics();

    // only send a report if stats have changed, and only send those changes
    const d: Partial<RawMetrics> = {};
    let key: keyof RawMetrics;
    for (key in metrics.current) {
      const val = metrics.current[key];

      const shouldSendValue =
        typeof val === "number"
          ? Number.isFinite(val) && !Number.isNaN(val) && val >= 0
          : Boolean(val);

      if (shouldSendValue && val !== metrics?.previous?.[key]) {
        (d[key] as typeof val) = val;
      }
    }
    if (Object.keys(d).length > 0) {
      send(ws, d);
    }

    timeOut = setTimeout(() => {
      report();
    }, 1e3);
  };

  const createNewWebSocket = async (
    playbackId: string,
    currentSource: string,
    numRetries = 0,
  ) => {
    try {
      if (!playbackId || !currentSource) {
        return null;
      }

      const prevWebsocket = await websocketPromise;

      prevWebsocket?.close?.(3077);

      const reportingWebsocketUrl = await getMetricsReportingWebsocketUrl({
        playbackId: playbackId,
        playbackUrl: currentSource,
        sessionToken: store.getState().__controls.sessionToken,
      });

      if (reportingWebsocketUrl) {
        const newWebSocket = new WebSocket(reportingWebsocketUrl);

        newWebSocket.addEventListener("open", async () => {
          // enable active statistics reporting
          report();
        });
        newWebSocket.addEventListener("message", (event) => {
          try {
            if (event?.data) {
              const json = JSON.parse(event.data);

              if (json?.meta?.bframes || json?.meta?.buffer_window) {
                store.getState().__controlsFunctions.setWebsocketMetadata({
                  bframes: json?.meta?.bframes
                    ? Number(json?.meta?.bframes)
                    : undefined,
                  bufferWindow: json?.meta?.buffer_window
                    ? Number(json?.meta?.buffer_window)
                    : undefined,
                });
              }
            }
          } catch (e) {
            console.warn("Failed to parse metadata from websocket.");
          }
        });
        newWebSocket.addEventListener("close", () => {
          // disable active statistics gathering
          if (timeOut) {
            clearTimeout(timeOut);
            timeOut = null;
            enabled = false;
          }

          // auto-reconnect with exponential backoff
          setTimeout(
            () => {
              if (enabled) {
                websocketPromise = createNewWebSocket(
                  playbackId,
                  currentSource,
                  numRetries + 1,
                );
              }
            },
            2 ** numRetries * 1e3,
          );
        });
        return newWebSocket;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  };

  const destroyMetricsListener = store.subscribe(
    (state) => ({
      playbackId: state.__controls.playbackId,
      finalUrl: state.currentUrl,
      type: state.currentSource?.type,
    }),
    (state) => {
      if (state?.playbackId && state?.finalUrl) {
        websocketPromise = createNewWebSocket(state.playbackId, state.finalUrl);
      }
    },
    {
      fireImmediately: true,
      equalityFn: (a, b) => {
        return (
          a.type === b.type &&
          a.playbackId === b.playbackId &&
          Boolean(a.finalUrl) === Boolean(b.finalUrl)
        );
      },
    },
  );

  try {
    const destroyTtffListener = store.subscribe((state, prevState) => {
      if (
        state.playing !== prevState.playing &&
        metricsStatus.getFirstPlayback() === null
      ) {
        metricsStatus.setFirstPlayback();
      }

      if (
        state.progress !== prevState.progress &&
        metricsStatus.getFirstFrameTime() === null
      ) {
        metricsStatus.setFirstFrameTime();
      }

      if (
        state.error?.message &&
        state.error?.message !== prevState.error?.message
      ) {
        metricsStatus.addError(state.error.message);
      }
    });

    const destroyMonitorListener = store.subscribe((state, prevState) => {
      // enable
      if (
        (state.playing !== prevState.playing && state.playing) ||
        (state.loading !== prevState.loading && state.loading)
      ) {
        monitor.init();
      }

      if (
        state.__controls.requestedRangeToSeekTo !==
        prevState.__controls.requestedRangeToSeekTo
      ) {
        monitor.reset();
      }

      if (state.playing !== prevState.playing && !state.playing) {
        monitor.destroy();
      }
    });

    const destroy = () => {
      enabled = false;

      destroyMetricsListener?.();
      destroyMonitorListener?.();
      destroyTtffListener?.();

      monitor?.destroy?.();
      metricsStatus?.destroy?.();

      if (timeOut) {
        clearTimeout(timeOut);
      }

      if (websocketPromise) {
        websocketPromise.then((websocket) => {
          websocket?.close(3077);
        });
      }
    };

    return { metrics: metricsStatus, destroy };
  } catch (e) {
    console.error(e);
  }

  return defaultResponse;
}

function send(webSocket: WebSocket, metrics: Partial<RawMetrics>) {
  if (webSocket.readyState !== webSocket.OPEN) {
    return;
  }

  webSocket.send(JSON.stringify(metrics));
}
