/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */

/**
 * Gather playback metrics from a generic html5 video (or audio) element and report those back to an arbitrary websocket using the same format the MistServer Meta-player uses.
 * @param video                 Element to capture playback metrics from
 * @param reportingWebsocketUrl Url to the websocket to report to
 */
export function reportVideoMetrics(video, reportingWebsocketUrl) {
  // console.log("reportGenericVideoMetrics: ", reportingWebsocketUrl)
  if (
    video._reportGenericVideoMetrics &&
    video._reportGenericVideoMetrics == reportingWebsocketUrl
  ) {
    // console.log("video._reportGenericVideoMetrics && (video._reportGenericVideoMetrics == reportingWebsocketUrl");
    return; //do not attach twice (to the same websocket)
  }
  if (!window.WebSocket) {
    console.log('no support to report in this browser');
    return;
  } //no support to report in this browser
  if (!('play' in video) || !('currentTime' in video)) {
    console.log('lazy check if this is a video or audio element');
    return;
  } //lazy check if this is a video or audio element

  video._reportGenericVideoMetrics = reportingWebsocketUrl;
  var ws;
  function connect(n) {
    ws = new WebSocket(reportingWebsocketUrl);
    ws.n = n ? n : 0;

    //ws.onmessage : there's no need to listen to messages from the server
    ws.onopen = function () {
      //enable active statistics reporting
      if (timeOut === null) {
        timeOut = true;
        report();
      }
      this.wasConnected = true;
      this.n = 0;
    };
    ws.onclose = function () {
      //disable active statistics gathering
      if (timeOut) {
        clearTimeout(timeOut);
      }
      timeOut = null;

      //autoreconnect if connection is broken
      if (ws.wasConnected) {
        setTimeout(function () {
          connect(ws.n++);
        }, Math.pow(2, ws.n) * 1e3); //if the connection keeps failing, wait longer before retrying
      }
    };
    // console.log("ws: ", ws);
    return ws;
  }

  try {
    ws = connect();
  } catch (e) {
    return false;
  }

  var timeOut = null;

  function send(obj) {
    if (ws.readyState != ws.OPEN) {
      return;
    }
    ws.send(JSON.stringify(obj));
  }

  var stats = {
    //save playback metrics here
    d: {
      //this contains the most recent data, any changes are immediately applied here
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
      pageUrl: location.href,
      sourceUrl: video.currentSrc,
    },
    last: {
      //this contains the metrics storage object that was sent last
      firstPlayback: null,
      nWaiting: 0,
      timeWaiting: 0,
      nStalled: 0,
      timeStalled: 0,
      timeUnpaused: 0,
      nError: 0,
      lastError: null,
      playbackScore: 1,
      autoplay: null,
      videoHeight: null,
      videoWidth: null,
      playerHeight: null,
      playerWidth: null,
    },
  };

  /////////////////////
  //  basics         //
  /////////////////////

  var firstplay = function () {
    stats.d['firstPlayback'] =
      new Date().getTime() - reportGenericVideoMetrics_bootMs;
    video.removeEventListener('playing', firstplay);
  };
  video.addEventListener('playing', firstplay);

  video.addEventListener('waiting', function () {
    stats.d['nWaiting']++;
  });
  video.addEventListener('stalled', function () {
    stats.d['nStalled']++;
  });
  video.addEventListener('error', function (e) {
    stats.d['nError']++;
    stats.d['lastError'] = video.error ? video.error.message : 'unknown';
  });

  /////////////////////
  //  playbackScore  //
  /////////////////////

  var monitor = {
    active: false,
    vars: {},
    averagingSteps: 20,
    init: function () {
      if (this.active) {
        return;
      } //it's already running, don't bother

      this.vars = {
        values: [],
        score: false,
      };
      this.active = true;
    },
    reset: function () {
      if (!this.active) {
        //it's not running, start it up
        this.init();
        return;
      }

      this.vars.values = [];
    },
    destroy: function () {
      if (!this.active) {
        return;
      } //it's not running, don't bother

      delete this.vars;
      this.active = false;
    },
    calcScore: function () {
      if (!this.active) {
        return;
      }

      var list = this.vars.values;
      list.push(this.getValue()); //add the current value to the history

      if (list.length <= 1) {
        return false;
      } //no history yet, can't calculate a score

      var score = this.valueToScore(list[0], list[list.length - 1]); //should be 1, decreases if bad

      //kick the oldest value from the array
      if (list.length > this.averagingSteps) {
        list.shift();
      }

      //the final score is the maximum of the averaged and the current value
      score = Math.max(score, list[list.length - 1].score);

      this.vars.score = score;

      stats.d['playbackScore'] = Math.round(score * 10) / 10;

      return score;
    },
    valueToScore: function (a, b) {
      //calculate the moving average
      //if this returns > 1, the video played faster than the clock
      //if this returns < 0, the video time went backwards
      var rate = 1;
      if ('playbackRate' in video) {
        rate = video.playbackRate;
      }
      return (b.video - a.video) / (b.clock - a.clock) / rate;
    },
    getValue: function () {
      //save the current testing value and time
      // If the video plays, this should keep a constant value. If the video is stalled, it will go up with 1sec/sec. If the video is playing faster, it will go down.
      //      current clock time         - current playback time
      var result = {
        clock: new Date().getTime() * 1e-3,
        video: video.currentTime,
      };
      if (this.vars.values.length) {
        result.score = this.valueToScore(
          this.vars.values[this.vars.values.length - 1],
          result,
        );
      }

      return result;
    },
  };

  //enable
  var events = ['loadstart', 'play', 'playing'];
  for (var i in events) {
    video.addEventListener(events[i], function () {
      monitor.init();
    });
  }
  //disable
  var events = ['loadeddata', 'pause', 'abort', 'emptied', 'ended'];
  for (var i in events) {
    video.addEventListener(events[i], function () {
      monitor.destroy();
    });
  }
  //reset
  var events = ['seeking', 'seeked', /*"canplay","playing",*/ 'ratechange'];
  for (var i in events) {
    video.addEventListener(events[i], function () {
      monitor.reset();
    });
  }

  ///////////////////////////////
  // cumulative time counting  //
  ///////////////////////////////

  if (Object && Object.defineProperty) {
    //for convenience we're defining the get of object properties here. It's not a disaster if these don't get gathered in older browsers. See https://caniuse.com/mdn-javascript_builtins_object_defineproperty

    var timeWaiting = 0;
    var waitingSince = false;
    var timeStalled = 0;
    var stalledSince = false;
    var timeUnpaused = 0;
    var unpausedSince = false;
    var d = stats.d;

    Object.defineProperty(d, 'timeWaiting', {
      get: function () {
        return (
          timeWaiting + (waitingSince ? new Date().getTime() - waitingSince : 0)
        );
      },
    });
    Object.defineProperty(d, 'timeStalled', {
      get: function () {
        return (
          timeStalled + (stalledSince ? new Date().getTime() - stalledSince : 0)
        );
      },
    });
    Object.defineProperty(d, 'timeUnpaused', {
      get: function () {
        return (
          timeUnpaused +
          (unpausedSince ? new Date().getTime() - unpausedSince : 0)
        );
      },
    });
    Object.defineProperty(d, 'videoHeight', {
      get: function () {
        return video ? video.videoHeight : null;
      },
    });
    Object.defineProperty(d, 'videoWidth', {
      get: function () {
        return video ? video.videoWidth : null;
      },
    });
    Object.defineProperty(d, 'playerHeight', {
      get: function () {
        return video ? video.clientHeight : null;
      },
    });
    Object.defineProperty(d, 'playerWidth', {
      get: function () {
        return video ? video.clientWidth : null;
      },
    });

    video.addEventListener('waiting', function () {
      timeWaiting = d.timeWaiting; //in case we get waiting several times in a row
      waitingSince = new Date().getTime();
    });
    video.addEventListener('stalled', function () {
      timeStalled = d.timeStalled; //in case we get stalled several times in a row
      stalledSince = new Date().getTime();
    });
    var events = ['playing', 'pause'];
    for (var i in events) {
      video.addEventListener(events[i], function () {
        timeWaiting = d.timeWaiting;
        timeStalled = d.timeStalled;
        waitingSince = false;
        stalledSince = false;
      });
    }
    video.addEventListener('playing', function () {
      timeUnpaused = d.timeUnpaused; //in case we get playing several times in a row
      unpausedSince = new Date().getTime();
    });
    video.addEventListener('pause', function () {
      timeUnpaused = d.timeUnpaused;
      unpausedSince = false;
    });
  }

  function report() {
    if (timeOut === null) {
      return;
    }

    monitor.calcScore(); //update playback score

    //only send a report if stats have changed, and only send those changes
    var havechanges = false;
    var d = {};
    for (var i in stats.d) {
      if (stats.d[i] != stats.last[i]) {
        d[i] = stats.d[i];
        havechanges = true;
        stats.last[i] = d[i];
      }
    }
    if (havechanges) {
      send(d);
    }

    timeOut = setTimeout(function () {
      report();
    }, 1e3);
  }

  return true;
}

let reportGenericVideoMetrics_bootMs = new Date().getTime(); //used for firstPlayback value

/* eslint-enable @typescript-eslint/no-unused-vars */
/* eslint-enable no-redeclare */
