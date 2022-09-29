export type RawMetrics = {
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

  player: 'generic';

  pageUrl: string;
  sourceUrl: string;
  duration: number | null;
};

export type PlaybackRecord = {
  clockTime: number;
  mediaTime: number;
  score: number;
};

export class PlaybackMonitor<TElement extends HTMLMediaElement> {
  active = false;
  values: PlaybackRecord[] = [];
  score: number | null = null;
  averagingSteps = 20;
  element: TElement;

  constructor(element: TElement) {
    this.element = element;
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
        mediaTime: this.element.currentTime,
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

      if (oldestValue !== undefined && currentValue !== undefined) {
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
    const rate = this?.element?.playbackRate ? this.element.playbackRate : 1;

    return (
      (b?.mediaTime ?? this.element.currentTime - a.mediaTime) /
      (b?.clockTime ?? Date.now() * 1e-3 - a.clockTime) /
      rate
    );
  }
}

export class MetricsStatus<
  TElement extends HTMLMediaElement | HTMLVideoElement,
> {
  retryCount = 0;
  connected = false;
  element: TElement;

  currentMetrics: RawMetrics;
  previousMetrics: RawMetrics | null = null;

  timeWaiting = 0;
  waitingSince = 0;
  timeStalled = 0;
  stalledSince = 0;
  timeUnpaused = 0;
  unpausedSince = 0;

  constructor(element: TElement) {
    this.element = element;
    this.currentMetrics = {
      firstPlayback: 0,
      nWaiting: 0,
      timeWaiting: 0,
      nStalled: 0,
      timeStalled: 0,
      timeUnpaused: 0,
      nError: 0,
      videoHeight: null,
      videoWidth: null,
      playerHeight: null,
      playerWidth: null,
      player: 'generic',
      pageUrl: '',
      sourceUrl: '',
      playbackScore: null,
      duration: null,
    };

    element.addEventListener('waiting', () => {
      this.timeWaiting = this._getTimeWaiting(); // in case we get waiting several times in a row
      this.waitingSince = Date.now();
    });
    element.addEventListener('stalled', () => {
      this.timeStalled = this._getTimeStalled(); // in case we get stalled several times in a row
      this.stalledSince = Date.now();
    });

    for (const event of ['playing', 'pause'] as const) {
      element.addEventListener(event, () => {
        this.timeWaiting = this._getTimeWaiting();
        this.timeStalled = this._getTimeStalled();
        this.waitingSince = 0;
        this.stalledSince = 0;
      });
    }
    element.addEventListener('playing', () => {
      this.timeUnpaused = this._getTimeUnpaused(); // in case we get playing several times in a row
      this.unpausedSince = Date.now();
    });
    element.addEventListener('pause', () => {
      this.timeUnpaused = this._getTimeUnpaused();
      this.unpausedSince = 0;
    });
  }

  _getTimeWaiting(): number {
    return (
      this.timeWaiting +
      (this.waitingSince ? Date.now() - this.waitingSince : 0)
    );
  }
  _getTimeStalled(): number {
    return (
      this.timeStalled +
      (this.stalledSince ? Date.now() - this.stalledSince : 0)
    );
  }
  _getTimeUnpaused(): number {
    return (
      this.timeUnpaused +
      (this.unpausedSince ? Date.now() - this.unpausedSince : 0)
    );
  }

  addError(error: string) {
    this.currentMetrics.nError++;
    this.currentMetrics.lastError = error;
  }
  incrementStalled() {
    this.currentMetrics.nStalled++;
  }
  incrementWaiting() {
    this.currentMetrics.nWaiting++;
  }

  setFirstPlayback() {
    this.currentMetrics.firstPlayback = Date.now() - bootMs;
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
      playerHeight: this.element ? this.element.clientHeight : null,
      playerWidth: this.element ? this.element.clientWidth : null,
      videoWidth: (this.element as HTMLVideoElement)?.videoWidth
        ? (this.element as HTMLVideoElement)?.videoWidth
        : null,
      videoHeight: (this.element as HTMLVideoElement)?.videoHeight
        ? (this.element as HTMLVideoElement)?.videoHeight
        : null,
      duration: this.element.duration,

      timeWaiting: this._getTimeWaiting(),
      timeStalled: this._getTimeStalled(),
      timeUnpaused: this._getTimeUnpaused(),
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
const VIDEO_METRICS_INITIALIZED_ATTRIBUTE = 'data-metrics-initialized';

type MediaMetrics<TElement extends HTMLMediaElement> = {
  metrics: MetricsStatus<TElement> | null;
  websocket: WebSocket | null;
  report: (() => void) | null;
};

/**
 * Gather playback metrics from a generic HTML5 video (or audio) element and
 * report those back to a websocket.
 * @param element                 Element to capture playback metrics from
 * @param reportingWebsocketUrl   URL to the websocket to report to
 */
export function reportMediaMetrics<TElement extends HTMLMediaElement>(
  element: TElement,
  reportingWebsocketUrl: string,
): MediaMetrics<TElement> {
  const defaultResponse: MediaMetrics<TElement> = {
    metrics: null,
    websocket: null,
    report: null,
  };

  // do not attach twice (to the same websocket)
  if (element.getAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE) === 'true') {
    return defaultResponse;
  }

  element.setAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE, 'true');

  if (!window.WebSocket) {
    console.log('Browser does not support WebSocket');
    return defaultResponse;
  }
  if (!('play' in element) || !('currentTime' in element)) {
    console.log('Element provided is not a media element');
    return defaultResponse;
  }

  const metricsStatus = new MetricsStatus(element);

  try {
    const createNewWebSocket = (numRetries = 0) => {
      const newWebSocket = new WebSocket(reportingWebsocketUrl);

      newWebSocket.onopen = function () {
        // enable active statistics reporting
        report();
      };
      newWebSocket.onclose = function () {
        // disable active statistics gathering
        if (timeOut) {
          clearTimeout(timeOut);
          timeOut = null;
          enabled = false;
        }

        // auto-reconnect with exponential backoff
        setTimeout(function () {
          createNewWebSocket(numRetries++);
        }, Math.pow(2, numRetries) * 1e3);
      };

      return newWebSocket;
    };

    const ws = createNewWebSocket();

    let timeOut: NodeJS.Timeout | null = null;
    let enabled = true;

    /////////////////////
    //  basics         //
    /////////////////////

    const firstPlay = () => {
      metricsStatus.setFirstPlayback();
      element.removeEventListener('playing', firstPlay);
    };
    element.addEventListener('playing', firstPlay);

    element.addEventListener('waiting', () => {
      metricsStatus.incrementWaiting();
    });
    element.addEventListener('stalled', () => {
      metricsStatus.incrementStalled();
    });
    element.addEventListener('error', () => {
      metricsStatus.addError(
        element?.error?.message ? element.error.message : 'unknown',
      );
    });

    /////////////////////
    //  playbackScore  //
    /////////////////////

    const monitor = new PlaybackMonitor(element);

    // enable
    for (const eventName of ['loadstart', 'play', 'playing'] as const) {
      element.addEventListener(eventName, function () {
        monitor.init();
      });
    }

    // disable
    for (const eventName of [
      'loadeddata',
      'pause',
      'abort',
      'emptied',
      'ended',
    ] as const) {
      element.addEventListener(eventName, function () {
        monitor.destroy();
      });
    }

    // reset
    for (const eventName of [
      'seeking',
      'seeked',
      /*"canplay","playing",*/
      'ratechange',
    ] as const) {
      element.addEventListener(eventName, function () {
        monitor.reset();
      });
    }

    const report = () => {
      if (!enabled) {
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

    return { metrics: metricsStatus, websocket: ws, report };
  } catch (e) {
    console.log(e);
  }

  return defaultResponse;
}

function send(webSocket: WebSocket, metrics: Partial<RawMetrics>) {
  if (webSocket.readyState !== webSocket.OPEN) {
    return;
  }
  webSocket.send(JSON.stringify(metrics));
}
