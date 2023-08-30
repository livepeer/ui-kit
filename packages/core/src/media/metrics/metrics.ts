import { getMetricsReportingUrl } from './utils';
import { MediaControllerStore } from '../controller';
import { MimeType } from '../mime';

type RawMetrics = {
  preloadTime: number;
  ttff: number;
  firstPlayback: number;

  nWaiting: number;
  timeWaiting: number;

  nStalled: number;
  timeStalled: number;

  timeUnpaused: number;

  nError: number;
  lastError?: string;

  videoHeight: number | null;
  videoWidth: number | null;
  playerHeight: number | null;
  playerWidth: number | null;

  playbackScore: number | null;

  player: `${'audio' | 'hls' | 'video' | 'webrtc' | 'unknown'}-${string}`;

  sourceType: MimeType | 'unknown';

  pageUrl: string;
  sourceUrl: string | null;
  duration: number | null;

  autoplay: 'autoplay' | 'preload-full' | 'preload-metadata' | 'standard';
  userAgent: string;

  uid: string;
};

type PlaybackRecord = {
  clockTime: number;
  mediaTime: number;
  score: number;
};

export class PlaybackMonitor<TElement, TMediaStream> {
  active = false;
  values: PlaybackRecord[] = [];
  score: number | null = null;
  averagingSteps = 20;
  store: MediaControllerStore<TElement, TMediaStream>;

  constructor(store: MediaControllerStore<TElement, TMediaStream>) {
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
      rate
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
    return typeof window !== 'undefined' && window.self !== window.top;
  } catch (e) {
    // if accessing window.top throws an exception due to cross-origin policy, the catch block will also return true,
    // indicating the code is running inside an iframe
    return true;
  }
}

export class MetricsStatus<TElement, TMediaStream> {
  requestedPlayTime = 0;
  firstFrameTime = 0;

  retryCount = 0;
  connected = false;
  store: MediaControllerStore<TElement, TMediaStream>;

  destroy: () => void;

  currentMetrics: RawMetrics;
  previousMetrics: RawMetrics | null = null;

  timeWaiting = new Timer();
  timeStalled = new Timer();
  timeUnpaused = new Timer();

  constructor(store: MediaControllerStore<TElement, TMediaStream>) {
    const currentState = store.getState();

    this.store = store;

    const windowHref =
      typeof window !== 'undefined' ? window?.location?.href ?? '' : '';

    const pageUrl = isInIframe()
      ? typeof document !== 'undefined'
        ? document?.referrer || windowHref
        : windowHref
      : windowHref;

    const playerPrefix = currentState?.src?.type ?? 'unknown';
    const version = currentState?.device.version ?? 'unknown';

    this.currentMetrics = {
      autoplay:
        currentState.priority && currentState.autoplay
          ? 'autoplay'
          : currentState.preload === 'full'
          ? 'preload-full'
          : currentState.preload === 'metadata'
          ? 'preload-metadata'
          : 'standard',
      duration: null,
      firstPlayback: 0,
      nError: 0,
      nStalled: 0,
      nWaiting: 0,
      pageUrl,
      playbackScore: null,
      player: `${playerPrefix}-${version}`,
      sourceType: currentState?.src?.mime ?? 'unknown',
      sourceUrl: currentState?.src?.src ?? null,
      playerHeight: null,
      playerWidth: null,
      preloadTime: 0,
      timeStalled: 0,
      timeUnpaused: 0,
      timeWaiting: 0,
      ttff: 0,
      uid: currentState.viewerId,
      userAgent: String(currentState?.device?.userAgent ?? '').replace(
        /\\|"/gm,
        '',
      ),
      videoHeight: null,
      videoWidth: null,
    };

    this.destroy = store.subscribe((state, prevState) => {
      if (this.requestedPlayTime === 0 && state._playLastTime !== 0) {
        this.requestedPlayTime = Math.max(state._playLastTime - bootMs, 0);
      }

      if (state.src?.src !== prevState.src?.src) {
        const playerPrefix = state?.src?.type ?? 'unknown';
        const version = state?.device.version ?? 'unknown';

        this.currentMetrics.player = `${playerPrefix}-${version}`;
        this.currentMetrics.sourceType = state.src?.mime ?? 'unknown';
        this.currentMetrics.sourceUrl = state.src?.src ?? null;
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
    this.currentMetrics.nError++;
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
      playerHeight: this.store.getState().size?.container?.height ?? null,
      playerWidth: this.store.getState().size?.container?.width ?? null,
      videoWidth: this.store.getState().size?.media?.width ?? null,
      videoHeight: this.store.getState().size?.media?.height ?? null,
      duration: this.store.getState().duration,

      nWaiting: this.timeWaiting.getCountStarts(),
      nStalled: this.timeStalled.getCountStarts(),

      timeWaiting: this.timeWaiting.getTotalTime(),
      timeStalled: this.timeStalled.getTotalTime(),
      timeUnpaused: this.timeUnpaused.getTotalTime(),

      // this is the amount of time that a video has had to preload content, from boot until play was requested
      preloadTime: this.requestedPlayTime,
      // time from when the first `play` event is emitted and the first progress update
      ttff:
        this.firstFrameTime > 0 && this.requestedPlayTime > 0
          ? Math.max(this.firstFrameTime - this.requestedPlayTime, 0)
          : 0,
    };

    const previousMetrics = this.previousMetrics;
    this.previousMetrics = currentMetrics;

    return {
      current: currentMetrics,
      previous: previousMetrics,
    };
  }
}

const generateRandomToken = () => {
  try {
    return Math.random().toString(16).substring(2);
  } catch (e) {
    //
  }

  return 'none';
};

const sessionToken = generateRandomToken(); // used to track playbacks across sessions

const bootMs = Date.now(); // used for firstPlayback value

export type MediaMetrics<TElement, TMediaStream> = {
  metrics: MetricsStatus<TElement, TMediaStream> | null;
  destroy: () => void;
};

/**
 * Gather playback metrics from a media store and
 * report them to a websocket. Automatically handles a redirect to get the
 * metrics endpoint.
 *
 * @param store Element to capture playback metrics from
 * @param onError Error callback
 */
export function addMediaMetricsToStore<TElement, TMediaStream>(
  store: MediaControllerStore<TElement, TMediaStream> | undefined | null,
  onError?: (error: unknown) => void,
): MediaMetrics<TElement, TMediaStream> {
  const defaultResponse: MediaMetrics<TElement, TMediaStream> = {
    metrics: null,
    destroy: () => {
      //
    },
  };

  if (!store) {
    return defaultResponse;
  }

  if (!WebSocket) {
    console.log('Environment does not support WebSocket');
    return defaultResponse;
  }

  let ws: WebSocket | null;

  let timeOut: NodeJS.Timeout | null = null;
  let enabled = true;

  const metricsStatus = new MetricsStatus(store);
  const monitor = new PlaybackMonitor(store);

  const report = () => {
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
      if (val !== metrics?.previous?.[key]) {
        (d[key] as typeof val) = val;
      }
    }
    if (Object.keys(d).length > 0) {
      send(ws, d);
    }

    timeOut = setTimeout(function () {
      report();
    }, 1e3);
  };

  let previousPlaybackId: string | null = null;

  const destroyPlaybackIdListener = store.subscribe((currentState) => {
    if (
      currentState?.playbackId &&
      currentState?.playbackId !== previousPlaybackId &&
      currentState?.src?.src &&
      currentState._element
    ) {
      const playbackId = currentState.playbackId;
      const currentSource = currentState.src;
      const playbackDomain = currentSource.src;

      previousPlaybackId = playbackId;

      try {
        const createNewWebSocket = async (numRetries = 0) => {
          const reportingWebsocketUrl = await getMetricsReportingUrl(
            playbackId,
            playbackDomain,
            sessionToken,
          );

          if (reportingWebsocketUrl) {
            const newWebSocket = new WebSocket(reportingWebsocketUrl);

            newWebSocket.addEventListener('open', () => {
              // enable active statistics reporting
              report();
            });
            newWebSocket.addEventListener('message', (event) => {
              try {
                if (event?.data) {
                  const json = JSON.parse(event.data);

                  if (json?.error && store.getState().live) {
                    onError?.(new Error(json.error));
                  }

                  if (json?.meta?.bframes || json?.meta?.buffer_window) {
                    store.getState().setWebsocketMetadata({
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
                console.warn('Failed to parse metadata from websocket.');
              }
            });
            newWebSocket.addEventListener('close', (event) => {
              // disable active statistics gathering
              if (timeOut) {
                clearTimeout(timeOut);
                timeOut = null;
                enabled = false;
              }

              // use random code for internal error
              if (event.code !== 3077) {
                // auto-reconnect with exponential backoff
                setTimeout(function () {
                  createNewWebSocket(numRetries++).then((websocket) => {
                    ws = websocket;
                  });
                }, Math.pow(2, numRetries) * 1e3);
              }
            });
            return newWebSocket;
          }

          return null;
        };

        createNewWebSocket()
          .then((websocket) => {
            ws = websocket;
          })
          .catch((e) => {
            console.error(e);
            onError?.(e);
          });
      } catch (e) {
        console.error(e);
      }
    }
  });

  try {
    const destroyTtffListener = store.subscribe((state, prevState) => {
      if (
        state.playing !== prevState.playing &&
        metricsStatus.getFirstPlayback() === 0
      ) {
        metricsStatus.setFirstPlayback();
      }

      if (
        state.progress !== prevState.progress &&
        metricsStatus.getFirstFrameTime() === 0
      ) {
        metricsStatus.setFirstFrameTime();
      }

      if (state.error !== prevState.error && state.error) {
        metricsStatus.addError(state.error ?? 'unknown');
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

      if (state._requestedRangeToSeekTo !== prevState._requestedRangeToSeekTo) {
        monitor.reset();
      }

      if (state.playing !== prevState.playing && !state.playing) {
        monitor.destroy();
      }
    });

    const destroy = () => {
      enabled = false;

      destroyPlaybackIdListener?.();
      destroyMonitorListener?.();
      destroyTtffListener?.();

      monitor?.destroy?.();
      metricsStatus?.destroy?.();

      if (timeOut) {
        clearTimeout(timeOut);
      }
      ws?.close(3077);
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
