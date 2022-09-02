type Metrics = {
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
};

type PlaybackRecord = {
  clockTime: number;
  videoTime: number;
  score: number;
};

class PlaybackMonitor {
  active = false;
  values: PlaybackRecord[] = [];
  score: number | null = null;
  averagingSteps = 20;
  video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
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
      // If the video plays, this should keep a constant value. If the video is stalled, it will go up with 1sec/sec. If the video is playing faster, it will go down.
      // current clock time - current playback time
      const latestPlaybackRecord =
        this.values.length > 0
          ? this.values[this.values.length - 1]
          : undefined;

      const currentValue = {
        clockTime: new Date().getTime() * 1e-3,
        videoTime: this.video.currentTime,
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
    // if this returns > 1, the video played faster than the clock
    // if this returns < 0, the video time went backwards
    const rate = this?.video?.playbackRate ? this.video.playbackRate : 1;

    return (
      (b?.videoTime ?? this.video.currentTime - a.videoTime) /
      (b?.clockTime ?? new Date().getTime() * 1e-3 - a.clockTime) /
      rate
    );
  }
}

class MetricsStatus {
  retryCount = 0;
  connected = false;
  video: HTMLVideoElement;

  currentMetrics: Metrics;
  previousMetrics: Metrics | null = null;

  timeWaiting = 0;
  waitingSince = 0;
  timeStalled = 0;
  stalledSince = 0;
  timeUnpaused = 0;
  unpausedSince = 0;

  constructor(video: HTMLVideoElement) {
    this.video = video;
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
    };

    video.addEventListener('waiting', () => {
      this.timeWaiting = this._getTimeWaiting(); // in case we get waiting several times in a row
      this.waitingSince = new Date().getTime();
    });
    video.addEventListener('stalled', () => {
      this.timeStalled = this._getTimeStalled(); // in case we get stalled several times in a row
      this.stalledSince = new Date().getTime();
    });

    for (const event of ['playing', 'pause'] as const) {
      video.addEventListener(event, () => {
        this.timeWaiting = this._getTimeWaiting();
        this.timeStalled = this._getTimeStalled();
        this.waitingSince = 0;
        this.stalledSince = 0;
      });
    }
    video.addEventListener('playing', () => {
      this.timeUnpaused = this._getTimeUnpaused(); // in case we get playing several times in a row
      this.unpausedSince = new Date().getTime();
    });
    video.addEventListener('pause', () => {
      this.timeUnpaused = this._getTimeUnpaused();
      this.unpausedSince = 0;
    });
  }

  _getTimeWaiting(): number {
    return (
      this.timeWaiting +
      (this.waitingSince ? new Date().getTime() - this.waitingSince : 0)
    );
  }
  _getTimeStalled(): number {
    return (
      this.timeStalled +
      (this.stalledSince ? new Date().getTime() - this.stalledSince : 0)
    );
  }
  _getTimeUnpaused(): number {
    return (
      this.timeUnpaused +
      (this.unpausedSince ? new Date().getTime() - this.unpausedSince : 0)
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

  setFirstPlayback(value: number) {
    this.currentMetrics.firstPlayback = value;
  }
  setPlaybackScore(playbackScore: number) {
    this.currentMetrics.playbackScore = playbackScore;
  }
  setConnected(isConnected: boolean) {
    this.connected = isConnected;
  }

  getMetrics() {
    const currentMetrics: Metrics = {
      ...this.currentMetrics,
      playerHeight: this.video ? this.video.clientHeight : null,
      playerWidth: this.video ? this.video.clientWidth : null,
      videoWidth: this.video ? this.video.videoHeight : null,
      videoHeight: this.video ? this.video.videoHeight : null,

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

const bootMs = new Date().getTime(); // used for firstPlayback value
const VIDEO_METRICS_INITIALIZED_ATTRIBUTE = 'data-video-metrics-initialized';

function send(webSocket: WebSocket, metrics: Partial<Metrics>) {
  if (webSocket.readyState !== webSocket.OPEN) {
    return;
  }
  webSocket.send(JSON.stringify(metrics));
}

/**
 * Gather playback metrics from a generic html5 video (or audio) element and
 * report those back to an arbitrary websocket.
 * @param video                 Element to capture playback metrics from
 * @param reportingWebsocketUrl url to the websocket to report to
 */
export function reportVideoMetrics(
  video: HTMLVideoElement,
  reportingWebsocketUrl: string,
) {
  // do not attach twice (to the same websocket)
  if (video.getAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE) === 'true') {
    return;
  }

  video.setAttribute(VIDEO_METRICS_INITIALIZED_ATTRIBUTE, 'true');

  if (!window.WebSocket) {
    console.log('Browser does not support websockets.');
    return;
  }
  if (!('play' in video) || !('currentTime' in video)) {
    console.log('Element provided is not a video element');
    return;
  }

  const metricsStatus = new MetricsStatus(video);

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

    /////////////////////
    //  basics         //
    /////////////////////

    const firstPlay = () => {
      metricsStatus.setFirstPlayback(new Date().getTime() - bootMs);
      video.removeEventListener('playing', firstPlay);
    };
    video.addEventListener('playing', firstPlay);

    video.addEventListener('waiting', () => {
      metricsStatus.incrementWaiting();
    });
    video.addEventListener('stalled', () => {
      metricsStatus.incrementStalled();
    });
    video.addEventListener('error', () => {
      metricsStatus.addError(
        video?.error?.message ? video.error.message : 'unknown',
      );
    });

    /////////////////////
    //  playbackScore  //
    /////////////////////

    const monitor = new PlaybackMonitor(video);

    // enable
    for (const eventName of ['loadstart', 'play', 'playing'] as const) {
      video.addEventListener(eventName, function () {
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
      video.addEventListener(eventName, function () {
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
      video.addEventListener(eventName, function () {
        monitor.reset();
      });
    }

    const report = () => {
      if (timeOut === null) {
        return;
      }

      // update playback score from monitor
      const playbackScore = monitor.calculateScore();
      if (playbackScore !== null) {
        metricsStatus.setPlaybackScore(playbackScore);
      }

      const metrics = metricsStatus.getMetrics();

      // only send a report if stats have changed, and only send those changes
      const d: Partial<Metrics> = {};
      let key: keyof Metrics;
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
  } catch (e) {
    return false;
  }

  return true;
}
