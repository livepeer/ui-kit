import { calculateJwkThumbprint } from "jose";
import { warn } from "../utils";
import type { MediaControllerStore, PlaybackRate } from "./controller";
import { getMetricsReportingPOSTUrl } from "./metrics-utils";
import type { Src, VideoQuality } from "./src";
import { generateRandomToken } from "./utils";

type MetricsOpts = {
  /**
   * Disables the `progress` event listener, which is used to monitor when media is in a "playing" state.
   */
  disableProgressListener?: boolean;
};

export type HeartbeatEvent = {
  // The properties below are sent on every heartbeat.

  /** The event ID. */
  id: string;
  /** The event type. */
  type: "heartbeat";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The number of errors that have occurred since last heartbeat. */
  errors: number;
  /** The number of warnings that have occurred since last heartbeat. */
  warnings: number;

  /** The number of times the current playback has stalled, since last heartbeat. */
  stalled_count: number;
  /** The *total* number of times the current playback has waited, since last heartbeat. */
  waiting_count: number;

  /** The time the playback has spent in a warning state, in ms, since last heartbeat. */
  time_warning_ms: number;
  /** The time the playback has spent in an errored state, in ms, since last heartbeat. */
  time_errored_ms: number;
  /** The time the playback has spent stalled, in ms, since last heartbeat. */
  time_stalled_ms: number;
  /** The time the playback has spent playing, in ms, since last heartbeat. */
  time_playing_ms: number;
  /** The time the playback has spent waiting, in ms, since last heartbeat. */
  time_waiting_ms: number;

  // The properties below are only sent once.

  /** The state of autoplay of the video. */
  autoplay_status?: "autoplay" | "none";

  /** The time from when the metrics were added to play, in milliseconds. */
  mount_to_play_ms?: number;
  /** The time from when the metrics were added to the first frame, in milliseconds. */
  mount_to_first_frame_ms?: number;
  /** The time from the first play event to the first frame, in milliseconds. Also called TTFF. */
  play_to_first_frame_ms?: number;

  /** The duration of the video, in milliseconds. This is only sent for VOD. */
  duration_ms?: number;
  /** The offset of the live video head compared to the server time, in milliseconds. */
  offset_ms?: number;

  // The properties below are only sent when they change.

  /** The height of the player element, in px. */
  player_height_px?: number;
  /** The width of the player element, in px. */
  player_width_px?: number;
  /** The height of the source video, in px. */
  video_height_px?: number;
  /** The width of the source video, in px. */
  video_width_px?: number;
  /** The height of the window, in px. */
  window_height_px?: number;
  /** The width of the window, in px. */
  window_width_px?: number;
};

export type ErrorEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type: "error";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The raw event error message. */
  message: string;
  /** The category of the error. */
  category: "access-control" | "permissions" | "unknown";
};

export type WarningEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type: "warning";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The raw event warning message. */
  message: string;
  /** The category of the warning. */
  category: "offline" | "fallback";
};

export type HtmlEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type:
    | "play"
    | "pause"
    | "enter-fullscreen"
    | "exit-fullscreen"
    | "enter-pip"
    | "exit-pip"
    | "can-play"
    | "ended"
    | "first-frame";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
};

export type ClipEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type: "clip";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The start time of the clip, in Unix ms. */
  startTime: number;
  /** The end time of the clip, in Unix ms. */
  endTime: number;
};

export type RateChangeEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type: "rate";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The playback rate. */
  payload: PlaybackRate;
};

export type SeekEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type: "seek";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The seek timestamp. */
  payload: number;
};

export type VideoQualityEvent = {
  /** The event ID. */
  id: string;
  /** The event type. */
  type: "video-quality";
  /** The timestamp of the event, in milliseconds. */
  timestamp: number;
  /** The video playback quality enum. */
  payload: VideoQuality;
};

export type PlaybackEvent =
  | HeartbeatEvent
  | ErrorEvent
  | WarningEvent
  | ClipEvent
  | HtmlEvent
  | RateChangeEvent
  | SeekEvent
  | VideoQualityEvent;

export type SessionData = {
  session_id: string;
  playback_id: string;
  protocol?: Src["mime"];
  domain: string | null;
  path: string | null;
  params: string | null;
  hash: string | null;
  source_url: string;
  player: Src["type"];
  version: string;
  user_agent?: string;
  uid?: string;
  events: PlaybackEvent[];
  live: boolean;
};

const globalLoadTimestampMs = Date.now();

/**
 * Gather playback metrics from a media store and
 * POSTs them to an HTTP endpoint, which must be the same node as the playback
 * URL.
 *
 * @param store Store to capture playback metrics from.
 * @param opts.interval The interval at which metrics are sent, in ms. Default 5000.
 * @param opts.disableProgressListener Disables the `progress` event listener, which is used to monitor when media is in a "playing" state.
 * @param opts.onPlaybackEvents A callback that is called when the player's metrics events are emitted. This can be used to integrate with other analytics providers.
 */
export function addMetricsToStore(
  store: MediaControllerStore | undefined | null,
  opts?: {
    interval?: number;
    disableProgressListener?: boolean;
    // biome-ignore lint/suspicious/noExplicitAny: allow any for incoming callback
    onPlaybackEvents?: (events: PlaybackEvent[]) => Promise<any> | any;
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

  if (typeof window === "undefined") {
    return defaultResponse;
  }

  const monitor = new MetricsMonitor(store, {
    disableProgressListener: opts?.disableProgressListener,
  });

  const isSendBeaconAvailable = "sendBeacon" in window.navigator;

  const interval = opts?.interval ?? 5000;

  const eventBuffer = new PlaybackEventBuffer();

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

  const destroyErrorListener = store.subscribe(
    (state) => state.error,
    async (error) => {
      if (error) {
        eventBuffer.addEvent(
          error.type === "offline" || error.type === "fallback"
            ? {
                id: generateRandomToken(),
                type: "warning",
                timestamp: Date.now(),
                category: error.type,
                message: error.message,
              }
            : {
                id: generateRandomToken(),
                type: "error",
                timestamp: Date.now(),
                category: error.type,
                message: error.message,
              },
        );
      }
    },
  );

  const destroyPlayListener = store.subscribe(
    (state) => state.__controls.playLastTime,
    async (timestamp) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: "play",
        timestamp,
      });
    },
  );

  const destroyPauseListener = store.subscribe(
    (state) => state.__controls.pauseLastTime,
    async (timestamp) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: "pause",
        timestamp,
      });
    },
  );

  const destroyClipListener = store.subscribe(
    (state) => state.__controls.requestedClipParams,
    async (params) => {
      if (params) {
        eventBuffer.addEvent({
          id: generateRandomToken(),
          type: "clip",
          timestamp: Date.now(),
          startTime: params.startTime,
          endTime: params.endTime,
        });
      }
    },
  );

  const destroyPipListener = store.subscribe(
    (state) => state.pictureInPicture,
    async (pictureInPicture) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: pictureInPicture ? "enter-pip" : "exit-pip",
        timestamp: Date.now(),
      });
    },
  );

  const destroyFullscreenListener = store.subscribe(
    (state) => state.fullscreen,
    async (fullscreen) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: fullscreen ? "enter-fullscreen" : "exit-fullscreen",
        timestamp: Date.now(),
      });
    },
  );

  const destroyCanPlayListener = store.subscribe(
    (state) => state.canPlay,
    async (canPlay) => {
      if (canPlay) {
        eventBuffer.addEvent({
          id: generateRandomToken(),
          type: "can-play",
          timestamp: Date.now(),
        });
      }
    },
  );

  const destroyEndedListener = store.subscribe(
    (state) => state.ended,
    async (ended) => {
      if (ended) {
        eventBuffer.addEvent({
          id: generateRandomToken(),
          type: "ended",
          timestamp: Date.now(),
        });
      }
    },
  );

  const destroyRateChangeListener = store.subscribe(
    (state) => state.playbackRate,
    async (playbackRate) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: "rate",
        timestamp: Date.now(),
        payload: playbackRate,
      });
    },
  );

  const destroyVideoQualityListener = store.subscribe(
    (state) => state.videoQuality,
    async (videoQuality) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: "video-quality",
        timestamp: Date.now(),
        payload: videoQuality,
      });
    },
  );

  const destroySeekListener = store.subscribe(
    (state) => state.__controls.requestedRangeToSeekTo,
    async (rangeToSeekTo) => {
      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: "seek",
        timestamp: Date.now(),
        payload: rangeToSeekTo,
      });
    },
  );

  const ic = new IncrementalCounter([
    "errors",
    "warnings",
    "stalled_count",
    "waiting_count",
    "time_warning_ms",
    "time_errored_ms",
    "time_stalled_ms",
    "time_playing_ms",
    "time_waiting_ms",
  ]);
  const vct = new ValueChangeTracker([
    "autoplay_status",
    "mount_to_first_frame_ms",
    "mount_to_play_ms",
    "play_to_first_frame_ms",
    "duration_ms",
    "offset_ms",
    "video_height_px",
    "video_width_px",
    "player_width_px",
    "player_height_px",
    "window_height_px",
    "window_width_px",
  ]);

  let firstFrameSent = false;

  const sendEvents =
    ({ isUnloading }: { isUnloading: boolean } = { isUnloading: false }) =>
    async () => {
      const currentState = store.getState();
      const currentControlsState = currentState.__controls;

      if (!currentState.currentSource) {
        warn("Not sending metrics since no current playback source parsed.");
        return;
      }

      if (!currentControlsState.playbackId) {
        warn("Not sending metrics since no playback ID parsed.");
        return;
      }

      // if we're not unloading, we add a heartbeat event to the queue

      const metricsSnapshot = monitor.getMetrics();

      if (!firstFrameSent && monitor.firstFrameTimestamp) {
        eventBuffer.addEvent({
          id: generateRandomToken(),
          type: "first-frame",
          timestamp: monitor.firstFrameTimestamp,
        });

        firstFrameSent = true;
      }

      eventBuffer.addEvent({
        id: generateRandomToken(),
        type: "heartbeat",
        timestamp: Date.now(),
        errors: ic.calculateIncrement("errors", metricsSnapshot.errorCount),
        warnings: ic.calculateIncrement(
          "warnings",
          metricsSnapshot.warningCount,
        ),

        stalled_count: ic.calculateIncrement(
          "stalled_count",
          metricsSnapshot.stalledCount,
        ),
        waiting_count: ic.calculateIncrement(
          "waiting_count",
          metricsSnapshot.waitingCount,
        ),

        time_errored_ms: ic.calculateIncrement(
          "time_errored_ms",
          metricsSnapshot.timeErrored,
        ),
        time_warning_ms: ic.calculateIncrement(
          "time_warning_ms",
          metricsSnapshot.timeWarning,
        ),
        time_stalled_ms: ic.calculateIncrement(
          "time_stalled_ms",
          metricsSnapshot.timeStalled,
        ),
        time_playing_ms: ic.calculateIncrement(
          "time_playing_ms",
          metricsSnapshot.timePlaying,
        ),
        time_waiting_ms: ic.calculateIncrement(
          "time_waiting_ms",
          metricsSnapshot.timeWaiting,
        ),

        // The properties below are only sent once.
        autoplay_status: vct.sendIfChanged(
          "autoplay_status",
          currentState.__initialProps.autoPlay ? "autoplay" : "none",
        ),

        mount_to_play_ms: vct.sendIfChanged(
          "mount_to_play_ms",
          metricsSnapshot.mountToPlay ?? undefined,
        ),
        mount_to_first_frame_ms: vct.sendIfChanged(
          "mount_to_first_frame_ms",
          metricsSnapshot.mountToFirstFrame ?? undefined,
        ),
        play_to_first_frame_ms: vct.sendIfChanged(
          "play_to_first_frame_ms",
          metricsSnapshot.playToFirstFrame ?? undefined,
        ),

        duration_ms: currentState?.live
          ? undefined
          : vct.sendIfChanged(
              "duration_ms",
              metricsSnapshot.duration ?? undefined,
            ),
        offset_ms: vct.sendIfChanged(
          "offset_ms",
          metricsSnapshot.offset ?? undefined,
        ),

        // The properties below are only sent when they change.
        video_height_px: vct.sendIfChanged(
          "video_height_px",
          metricsSnapshot.videoHeight ?? undefined,
        ),
        video_width_px: vct.sendIfChanged(
          "video_width_px",
          metricsSnapshot.videoWidth ?? undefined,
        ),
        player_height_px: vct.sendIfChanged(
          "player_height_px",
          metricsSnapshot.playerHeight ?? undefined,
        ),
        player_width_px: vct.sendIfChanged(
          "player_width_px",
          metricsSnapshot.playerWidth ?? undefined,
        ),
        window_height_px: vct.sendIfChanged(
          "window_height_px",
          metricsSnapshot.windowHeight ?? undefined,
        ),
        window_width_px: vct.sendIfChanged(
          "window_width_px",
          metricsSnapshot.windowWidth ?? undefined,
        ),
      });

      const internalEvents = eventBuffer.getInternalEvents();

      try {
        await opts?.onPlaybackEvents?.(internalEvents);
      } catch (e) {
        console.error(e);

        eventBuffer.onInternalFailure(internalEvents);
      }

      const metricsUrl = currentState.metricsReportingUrl;

      if (metricsUrl) {
        const abortController = new AbortController();

        const id = setTimeout(
          () => abortController.abort(),
          interval - 500, // we abort 500ms before the next request is scheduled
        );

        const externalEvents = eventBuffer.getExternalEvents();

        // if we're unloading and there's no events to send, we return early
        // since there's nothing to do here
        if (isUnloading && externalEvents.length === 0) {
          return;
        }

        try {
          const windowHref =
            typeof window !== "undefined"
              ? window?.location?.href ?? null
              : null;

          const pageUrlString = isInIframe()
            ? typeof document !== "undefined"
              ? document?.referrer || windowHref
              : windowHref
            : windowHref;

          const pageUrl = pageUrlString ? new URL(pageUrlString) : null;

          const playerPrefix = currentState?.currentSource?.type ?? "unknown";
          const version = currentState?.__device.version ?? "unknown";

          const sessionData: SessionData = {
            live: currentState.live,
            session_id: currentControlsState.sessionToken,
            playback_id: currentControlsState.playbackId,
            protocol: currentState.currentSource.mime ?? undefined,
            domain: pageUrl?.hostname ?? null,
            path: pageUrl?.pathname ?? null,
            params: pageUrl?.search ?? null,
            hash: pageUrl?.hash ?? null,
            source_url: currentState.currentSource.src,
            player: playerPrefix,
            version,
            user_agent: String(currentState?.__device?.userAgent ?? "").replace(
              /\\|"/gm,
              "",
            ),
            uid: currentState.__initialProps.viewerId ?? undefined,
            events: externalEvents,
          };

          const data = JSON.stringify(sessionData);

          if (isUnloading && isSendBeaconAvailable) {
            const success = window?.navigator?.sendBeacon?.(metricsUrl, data);

            if (!success) {
              throw new Error("Beacon response was not OK");
            }
          } else {
            const response = await fetch(metricsUrl, {
              method: "POST",
              mode: "cors",
              body: data,
              signal: abortController.signal,
            });

            // we consume the response body since some envs this causes memory leaks
            await response.text();

            if (!response.ok) {
              throw new Error("Fetch response was not OK");
            }
          }
        } catch (e) {
          console.error(
            new Error(
              (e as Error)?.message ??
                "Error with metrics reporting, re-enqueuing events...",
            ),
          );

          eventBuffer.onExternalFailure(externalEvents);
        } finally {
          clearTimeout(id);
        }
      }
    };

  // set an interval to send events
  const eventsTimer = setInterval(sendEvents(), interval);

  const unloadEvent = "onpagehide" in self ? "pagehide" : "unload";
  const unloadingCallback = sendEvents({ isUnloading: true });

  // Set up event handler for pageleave
  // Use `onpagehide` if available, see https://calendar.perfplanet.com/2020/beaconing-in-practice/#beaconing-reliability-avoiding-abandons
  window?.addEventListener?.(unloadEvent, unloadingCallback);

  const onVisibilityChange = async () => {
    if (document.visibilityState === "hidden") {
      return unloadingCallback();
    }
  };

  // visibilitychange may be your last opportunity to beacon,
  // though the user could come back later
  window?.addEventListener?.("visibilitychange", onVisibilityChange);

  return {
    destroy: () => {
      if (eventsTimer) {
        clearInterval?.(eventsTimer);
      }

      destroyCanPlayListener?.();
      destroyClipListener?.();
      destroyEndedListener?.();
      destroyErrorListener?.();
      destroyFinalUrlListener?.();
      destroyFullscreenListener?.();
      destroyPipListener?.();
      destroyPlayListener?.();
      destroyPauseListener?.();
      destroyRateChangeListener?.();
      destroySeekListener?.();
      destroyVideoQualityListener?.();

      // we remove the visibility callback since this is called too frequently when component is not visible
      window?.removeEventListener?.("visibilitychange", onVisibilityChange);
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

export class PlaybackEventBuffer {
  private internalBuffer: PlaybackEvent[] = [];
  private externalBuffer: PlaybackEvent[] = [];

  // we cap at 25k events, which assumed that each event could be max 200 bytes
  // this should be revised when event structure changes
  public readonly maxBufferSize = 25_000;

  public addEvent(event: PlaybackEvent) {
    this.addEvents([event]);
  }

  public addEvents(events: PlaybackEvent[]) {
    for (const newEvent of [...events]) {
      if (newEvent.type !== "heartbeat") {
        this.externalBuffer.push(newEvent);
        continue;
      }

      const existingEventIndex = this.externalBuffer.findIndex(
        (event) => event.type === "heartbeat",
      );

      if (existingEventIndex === -1) {
        this.externalBuffer.push(newEvent);
      } else {
        const existingEvent = this.externalBuffer[
          existingEventIndex
        ] as HeartbeatEvent;

        const mergedEvent: HeartbeatEvent = {
          ...existingEvent,
          id:
            existingEvent.timestamp < newEvent.timestamp
              ? existingEvent.id
              : newEvent.id,
          timestamp: Math.max(existingEvent.timestamp, newEvent.timestamp),
          errors: existingEvent.errors + newEvent.errors,
          warnings: existingEvent.warnings + newEvent.warnings,
          stalled_count: existingEvent.stalled_count + newEvent.stalled_count,
          waiting_count: existingEvent.waiting_count + newEvent.waiting_count,
          time_warning_ms:
            existingEvent.time_warning_ms + newEvent.time_warning_ms,
          time_errored_ms:
            existingEvent.time_errored_ms + newEvent.time_errored_ms,
          time_stalled_ms:
            existingEvent.time_stalled_ms + newEvent.time_stalled_ms,
          time_playing_ms:
            existingEvent.time_playing_ms + newEvent.time_playing_ms,
          time_waiting_ms:
            existingEvent.time_waiting_ms + newEvent.time_waiting_ms,

          ...(existingEvent.mount_to_first_frame_ms ||
          newEvent.mount_to_first_frame_ms
            ? {
                mount_to_first_frame_ms:
                  (existingEvent.mount_to_first_frame_ms ?? 0) +
                  (newEvent.mount_to_first_frame_ms ?? 0),
              }
            : {}),
          ...(existingEvent.mount_to_play_ms || newEvent.mount_to_play_ms
            ? {
                mount_to_play_ms:
                  (existingEvent.mount_to_play_ms ?? 0) +
                  (newEvent.mount_to_play_ms ?? 0),
              }
            : {}),
          ...(existingEvent.play_to_first_frame_ms ||
          newEvent.play_to_first_frame_ms
            ? {
                play_to_first_frame_ms:
                  (existingEvent.play_to_first_frame_ms ?? 0) +
                  (newEvent.play_to_first_frame_ms ?? 0),
              }
            : {}),
        };

        // Replace the old event with the merged one
        this.externalBuffer[existingEventIndex] = mergedEvent;
      }
    }

    this.internalBuffer = [...events, ...this.internalBuffer];

    this.trimBuffer();
  }

  public getInternalEvents() {
    const eventsToSend = [...this.internalBuffer];
    this.internalBuffer = [];

    return eventsToSend;
  }

  public getExternalEvents() {
    const eventsToSend = [...this.externalBuffer];
    this.externalBuffer = [];

    return eventsToSend;
  }

  public onInternalFailure(pendingEvents: PlaybackEvent[]) {
    this.internalBuffer = [...this.internalBuffer, ...pendingEvents];

    this.trimBuffer();
  }

  public onExternalFailure(pendingEvents: PlaybackEvent[]) {
    this.externalBuffer = [...this.externalBuffer, ...pendingEvents];

    this.trimBuffer();
  }

  private trimBuffer() {
    if (this.internalBuffer.length > this.maxBufferSize) {
      const excess = this.internalBuffer.length - this.maxBufferSize;
      this.internalBuffer = this.internalBuffer.slice(excess);
    }

    if (this.externalBuffer.length > this.maxBufferSize) {
      const excess = this.externalBuffer.length - this.maxBufferSize;
      this.externalBuffer = this.externalBuffer.slice(excess);
    }
  }
}

export class IncrementalCounter<K extends keyof HeartbeatEvent> {
  private counts: Record<K, number>;

  constructor(keys: K[]) {
    this.counts = keys.reduce(
      (acc, key) => {
        acc[key] = 0;
        return acc;
      },
      {} as Record<K, number>,
    );
  }

  public calculateIncrement(key: K, newCount: number): number {
    if (newCount < this.counts[key]) {
      return 0;
    }

    const increment = newCount - this.counts[key];

    this.counts[key] = newCount;

    return increment;
  }
}

export class ValueChangeTracker<Keys extends keyof HeartbeatEvent> {
  private lastValues: Record<Keys, string | number | undefined>;

  constructor(keys: Keys[]) {
    this.lastValues = keys.reduce(
      (acc, key) => {
        acc[key] = undefined;
        return acc;
      },
      {} as Record<Keys, string | number | undefined>,
    );
  }

  public sendIfChanged<T>(key: Keys, newValue: T): T | undefined {
    if (this.lastValues[key] !== newValue) {
      this.lastValues[key] = newValue as string | number | undefined;
      return newValue;
    }

    return undefined;
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

type RawMetrics = {
  mountToPlay: number | null;
  mountToFirstFrame: number | null;
  playToFirstFrame: number | null;

  duration: number | null;
  errorCount: number;
  warningCount: number;
  offset: number | null;
  playerHeight: number | null;
  playerWidth: number | null;
  stalledCount: number;
  timeErrored: number;
  timeWarning: number;
  timeStalled: number;
  timePlaying: number;
  timeWaiting: number;
  videoHeight: number | null;
  videoWidth: number | null;
  waitingCount: number;
  windowHeight: number | null;
  windowWidth: number | null;
};

class MetricsMonitor {
  retryCount = 0;
  connected = false;
  store: MediaControllerStore;

  destroy: () => void;

  firstFrameTimestamp: number | null = null;
  currentMetrics: RawMetrics;
  previousMetrics: RawMetrics | null = null;

  timerErrored = new Timer();
  timerWaiting = new Timer();
  timerStalled = new Timer();
  timerWarning = new Timer();

  timerPlaying = new Timer();

  constructor(store: MediaControllerStore, opts: MetricsOpts) {
    this.store = store;

    this.currentMetrics = {
      mountToPlay: null,
      mountToFirstFrame: null,
      playToFirstFrame: null,

      duration: null,
      errorCount: 0,
      warningCount: 0,
      offset: null,
      playerHeight: null,
      playerWidth: null,
      stalledCount: 0,
      timeErrored: 0,
      timeWarning: 0,
      timeStalled: 0,
      timePlaying: 0,
      timeWaiting: 0,
      videoHeight: null,
      videoWidth: null,
      waitingCount: 0,
      windowHeight: null,
      windowWidth: null,
    };

    const destroyFirstPlayListener = store.subscribe(
      (state) => state.__controls.playLastTime,
      async (playLastTime) => {
        if (playLastTime >= 0) {
          // this is the amount of time that the media has had to preload content, from boot until play was requested
          if (this.currentMetrics.mountToPlay === null) {
            this.currentMetrics.mountToPlay = Math.max(
              playLastTime - globalLoadTimestampMs,
              0,
            );
          }
        }
      },
    );

    const destroyPlayingListener = store.subscribe(
      (state) => state.playing,
      async (playing) => {
        if (playing) {
          this.timerWarning.stop();
          this.timerErrored.stop();
          this.timerStalled.stop();
          this.timerWaiting.stop();

          this.timerPlaying.start();
        } else {
          this.timerPlaying.stop();
        }
      },
    );

    const destroyPlayLastTimeListener = store.subscribe(
      (state) => state.__controls.playLastTime,
      async (playLastTime) => {
        if (playLastTime >= 0) {
          this.timerWarning.stop();
          this.timerErrored.stop();
          this.timerStalled.stop();
          this.timerWaiting.stop();

          this.timerPlaying.start();
        }
      },
    );

    const destroyProgressListener = store.subscribe(
      (state) => state.progress,
      async () => {
        if (
          opts.disableProgressListener !== true &&
          !this.timerPlaying.startTime
        ) {
          this.timerWarning.stop();
          this.timerErrored.stop();
          this.timerStalled.stop();
          this.timerWaiting.stop();
          this.timerPlaying.start();
        }

        const now = Date.now();

        // this is the amount of time that a video took to show the first frame, from boot until progress
        if (this.currentMetrics.mountToFirstFrame === null) {
          this.currentMetrics.mountToFirstFrame = Math.max(
            now - globalLoadTimestampMs,
            0,
          );
        }

        // this is the amount of time that a video took from the first play event to the first progress
        // previously called TTFF
        if (
          this.currentMetrics.playToFirstFrame === null &&
          this.currentMetrics.mountToPlay !== null
        ) {
          this.currentMetrics.playToFirstFrame = Math.max(
            now - this.currentMetrics.mountToPlay - globalLoadTimestampMs,
            0,
          );
          this.firstFrameTimestamp = now;
        }
      },
    );

    const destroyErroredListener = store.subscribe(
      (state) => state.error,
      async (error) => {
        if (error?.type) {
          const isWarning =
            error.type === "offline" || error.type === "fallback";

          if (isWarning) {
            this.timerWarning.start();
          } else {
            this.timerErrored.start();
          }
          this.timerPlaying.stop();

          if (isWarning) {
            this.addWarning();
          } else {
            this.addError();
          }
        }
      },
    );

    const destroyStalledListener = store.subscribe(
      (state) => state.stalled,
      async (stalled) => {
        if (stalled) {
          this.timerStalled.start();
          this.timerPlaying.stop();
        }
      },
    );

    const destroyWaitingListener = store.subscribe(
      (state) => state.waiting,
      async (waiting) => {
        if (waiting) {
          this.timerWaiting.start();
          this.timerPlaying.stop();
        }
      },
    );

    this.destroy = () => {
      destroyErroredListener?.();
      destroyFirstPlayListener?.();
      destroyPlayingListener?.();
      destroyPlayLastTimeListener?.();
      destroyProgressListener?.();
      destroyStalledListener?.();
      destroyWaitingListener?.();
    };
  }

  addError() {
    this.currentMetrics.errorCount = this.currentMetrics.errorCount + 1;
  }

  addWarning() {
    this.currentMetrics.warningCount = this.currentMetrics.warningCount + 1;
  }

  setConnected(isConnected: boolean) {
    this.connected = isConnected;
  }

  getMetrics() {
    const duration = this.store.getState().duration;
    const currentMetrics: RawMetrics = {
      ...this.currentMetrics,

      playerHeight:
        this.store.getState().__controls.size?.container?.height || null,
      playerWidth:
        this.store.getState().__controls.size?.container?.width || null,
      videoWidth: this.store.getState().__controls.size?.media?.width || null,
      videoHeight: this.store.getState().__controls.size?.media?.height || null,
      windowWidth: this.store.getState().__controls.size?.window?.width || null,
      windowHeight:
        this.store.getState().__controls.size?.window?.height || null,
      duration:
        Number.isFinite(duration) && !Number.isNaN(duration)
          ? Math.floor(duration * 1000)
          : null,

      waitingCount: this.timerWaiting.getCountStarts(),
      stalledCount: this.timerStalled.getCountStarts(),

      timeWarning: this.timerWarning.getTotalTime(),
      timeErrored: this.timerErrored.getTotalTime(),
      timeWaiting: this.timerWaiting.getTotalTime(),
      timeStalled: this.timerStalled.getTotalTime(),
      timePlaying: this.timerPlaying.getTotalTime(),

      offset: this.store.getState().__controls.playbackOffsetMs ?? null,
    };

    return currentMetrics;
  }
}
