import { beforeEach, describe, expect, it } from "vitest";

import {
  type HeartbeatEvent,
  IncrementalCounter,
  type PlaybackEvent,
  PlaybackEventBuffer,
  ValueChangeTracker,
} from "./metrics-new";

let idCounter = 1;

const heartbeatErrors = 2;
const heartbeatWarnings = 3;
const heartbeatStalledCount = 1;
const heartbeatWaitingCount = 4;

const heartbeatWarningMs = 10;
const heartbeatErroredMs = 15;
const heartbeatPlayingMs = 4500;
const heartbeatStalledMs = 20;
const heartbeatWaitingMs = 25;

const getDummyPlaybackEvent = (
  type: "heartbeat" | "error" | "play",
): PlaybackEvent => {
  const id = (idCounter++).toFixed(0);
  return type === "heartbeat"
    ? {
        id,
        timestamp: Date.now() + idCounter,
        type,
        errors: heartbeatErrors,
        warnings: heartbeatWarnings,
        stalled_count: heartbeatStalledCount,
        waiting_count: heartbeatWaitingCount,
        time_warning_ms: heartbeatWarningMs,
        time_errored_ms: heartbeatErroredMs,
        time_playing_ms: heartbeatPlayingMs,
        time_stalled_ms: heartbeatStalledMs,
        time_waiting_ms: heartbeatWaitingMs,
        ...(id === "1"
          ? {
              autoplay_status: "autoplay",
              mount_to_first_frame_ms: 1000,
              mount_to_play_ms: 2000,
              play_to_first_frame_ms: 3000,
              duration_ms: 60000,
              offset_ms: 500,
              player_height_px: 720,
              player_width_px: 1280,
              video_height_px: 1080,
              video_width_px: 1920,
              window_height_px: 900,
              window_width_px: 1440,
            }
          : {}),
      }
    : type === "play"
      ? {
          id: (idCounter++).toFixed(0),
          timestamp: Date.now(),
          type,
        }
      : {
          id: (idCounter++).toFixed(0),
          timestamp: Date.now(),
          type,
          message: "Error",
          category: "access-control",
        };
};

describe("PlaybackEventBuffer", () => {
  beforeEach(() => {
    idCounter = 1;
  });

  describe("max length", () => {
    it("adds and retrieves single heartbeat event", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent("heartbeat"));

      const events = buffer.getExternalEvents();

      expect(events).toMatchInlineSnapshot(`
        [
          {
            "autoplay_status": "autoplay",
            "duration_ms": 60000,
            "errors": 2,
            "id": "1",
            "mount_to_first_frame_ms": 1000,
            "mount_to_play_ms": 2000,
            "offset_ms": 500,
            "play_to_first_frame_ms": 3000,
            "player_height_px": 720,
            "player_width_px": 1280,
            "stalled_count": 1,
            "time_errored_ms": 15,
            "time_playing_ms": 4500,
            "time_stalled_ms": 20,
            "time_waiting_ms": 25,
            "time_warning_ms": 10,
            "timestamp": 1643673600002,
            "type": "heartbeat",
            "video_height_px": 1080,
            "video_width_px": 1920,
            "waiting_count": 4,
            "warnings": 3,
            "window_height_px": 900,
            "window_width_px": 1440,
          },
        ]
      `);
    });

    it("adds and enqueues on failure", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent("heartbeat"));

      const events = buffer.getExternalEvents();

      expect(buffer.getExternalEvents()).length(0);

      buffer.onExternalFailure(events);

      expect(buffer.getExternalEvents()).toMatchInlineSnapshot(`
        [
          {
            "autoplay_status": "autoplay",
            "duration_ms": 60000,
            "errors": 2,
            "id": "1",
            "mount_to_first_frame_ms": 1000,
            "mount_to_play_ms": 2000,
            "offset_ms": 500,
            "play_to_first_frame_ms": 3000,
            "player_height_px": 720,
            "player_width_px": 1280,
            "stalled_count": 1,
            "time_errored_ms": 15,
            "time_playing_ms": 4500,
            "time_stalled_ms": 20,
            "time_waiting_ms": 25,
            "time_warning_ms": 10,
            "timestamp": 1643673600002,
            "type": "heartbeat",
            "video_height_px": 1080,
            "video_width_px": 1920,
            "waiting_count": 4,
            "warnings": 3,
            "window_height_px": 900,
            "window_width_px": 1440,
          },
        ]
      `);
    });

    it("adds a lot of events and caps at max", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < buffer.maxBufferSize + 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent("error"));
      }

      expect(buffer.getExternalEvents()).length(buffer.maxBufferSize);
    });

    it("adds a lot of heartbeats and caps at 1", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 500; i++) {
        buffer.addEvent(getDummyPlaybackEvent("heartbeat"));
      }

      expect(buffer.getExternalEvents()).length(1);
    });

    it("combines multiple heartbeat events into one", async () => {
      const buffer = new PlaybackEventBuffer();

      const loopCount = 5566;

      for (let i = 0; i < loopCount; i++) {
        buffer.addEvent(getDummyPlaybackEvent("heartbeat"));
        buffer.addEvent(getDummyPlaybackEvent("error"));
      }

      const events = buffer.getExternalEvents();

      expect(events[0]).toMatchInlineSnapshot(`
        {
          "autoplay_status": "autoplay",
          "duration_ms": 60000,
          "errors": 11132,
          "id": "1",
          "mount_to_first_frame_ms": 1000,
          "mount_to_play_ms": 2000,
          "offset_ms": 500,
          "play_to_first_frame_ms": 3000,
          "player_height_px": 720,
          "player_width_px": 1280,
          "stalled_count": 5566,
          "time_errored_ms": 83490,
          "time_playing_ms": 25047000,
          "time_stalled_ms": 111320,
          "time_waiting_ms": 139150,
          "time_warning_ms": 55660,
          "timestamp": 1643673616697,
          "type": "heartbeat",
          "video_height_px": 1080,
          "video_width_px": 1920,
          "waiting_count": 22264,
          "warnings": 16698,
          "window_height_px": 900,
          "window_width_px": 1440,
        }
      `);
      expect(events).length(loopCount + 1);

      const heartbeat = events.find((event) => event.type === "heartbeat");

      expect(heartbeat?.time_playing_ms).toBe(loopCount * heartbeatPlayingMs);
      expect(heartbeat?.time_stalled_ms).toBe(loopCount * heartbeatStalledMs);
      expect(heartbeat?.time_waiting_ms).toBe(loopCount * heartbeatWaitingMs);
      expect(heartbeat?.time_warning_ms).toBe(loopCount * heartbeatWarningMs);
      expect(heartbeat?.time_errored_ms).toBe(loopCount * heartbeatErroredMs);
      expect(heartbeat?.errors).toBe(loopCount * heartbeatErrors);
      expect(heartbeat?.warnings).toBe(loopCount * heartbeatWarnings);
      expect(heartbeat?.stalled_count).toBe(loopCount * heartbeatStalledCount);
      expect(heartbeat?.waiting_count).toBe(loopCount * heartbeatWaitingCount);
    });

    it("combines many heartbeat events into one and leaves out missing fields", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent("heartbeat"));

      // clear the buffer
      buffer.getExternalEvents();

      const loopCount = 1234;

      for (let i = 0; i < loopCount; i++) {
        buffer.addEvent(getDummyPlaybackEvent("heartbeat"));
        buffer.addEvent(getDummyPlaybackEvent("error"));
      }

      const events = buffer.getExternalEvents();

      expect(events).length(loopCount + 1);

      expect(events[0]).toMatchInlineSnapshot(`
        {
          "errors": 2468,
          "id": "2",
          "stalled_count": 1234,
          "time_errored_ms": 18510,
          "time_playing_ms": 5553000,
          "time_stalled_ms": 24680,
          "time_waiting_ms": 30850,
          "time_warning_ms": 12340,
          "timestamp": 1643673603702,
          "type": "heartbeat",
          "waiting_count": 4936,
          "warnings": 3702,
        }
      `);

      const heartbeat = events.find((event) => event.type === "heartbeat");

      expect(heartbeat?.time_playing_ms).toBe(loopCount * heartbeatPlayingMs);
      expect(heartbeat?.time_stalled_ms).toBe(loopCount * heartbeatStalledMs);
      expect(heartbeat?.time_waiting_ms).toBe(loopCount * heartbeatWaitingMs);
      expect(heartbeat?.time_warning_ms).toBe(loopCount * heartbeatWarningMs);
      expect(heartbeat?.time_errored_ms).toBe(loopCount * heartbeatErroredMs);

      expect(heartbeat?.errors).toBe(loopCount * heartbeatErrors);
      expect(heartbeat?.warnings).toBe(loopCount * heartbeatWarnings);
      expect(heartbeat?.stalled_count).toBe(loopCount * heartbeatStalledCount);
      expect(heartbeat?.waiting_count).toBe(loopCount * heartbeatWaitingCount);

      expect(heartbeat?.offset_ms).toBeUndefined();

      buffer.addEvent(getDummyPlaybackEvent("heartbeat"));

      expect(buffer.getExternalEvents()).toMatchInlineSnapshot(`
        [
          {
            "errors": 2,
            "id": "3704",
            "stalled_count": 1,
            "time_errored_ms": 15,
            "time_playing_ms": 4500,
            "time_stalled_ms": 20,
            "time_waiting_ms": 25,
            "time_warning_ms": 10,
            "timestamp": 1643673603705,
            "type": "heartbeat",
            "waiting_count": 4,
            "warnings": 3,
          },
        ]
      `);
    });

    it("adds a lot of events and enqueues new ones to front", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent("error"));
      }

      buffer.addEvent(getDummyPlaybackEvent("play"));

      expect(buffer.getExternalEvents()[0]).toMatchInlineSnapshot(`
        {
          "category": "access-control",
          "id": "2",
          "message": "Error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
    });

    it("adds a lot of events and enqueues errored ones to back", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 10; i++) {
        buffer.addEvent(getDummyPlaybackEvent("play"));
      }

      buffer.onExternalFailure([getDummyPlaybackEvent("error")]);

      const events = buffer.getExternalEvents();

      expect(events).length(11);

      expect(events[events.length - 1]).toMatchInlineSnapshot(`
        {
          "category": "access-control",
          "id": "22",
          "message": "Error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
      expect(events[0]).toMatchInlineSnapshot(`
        {
          "id": "2",
          "timestamp": 1643673600000,
          "type": "play",
        }
      `);
    });

    it("adds a lot of events and errored get trimmed", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < buffer.maxBufferSize + 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent("play"));
      }

      buffer.onExternalFailure([getDummyPlaybackEvent("error")]);

      const externalEvents = buffer.getExternalEvents();
      const internalEvents = buffer.getInternalEvents();

      expect(externalEvents).length(buffer.maxBufferSize);
      expect(internalEvents).length(buffer.maxBufferSize);

      expect(externalEvents[externalEvents.length - 1]).toMatchInlineSnapshot(`
        {
          "category": "access-control",
          "id": "52002",
          "message": "Error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
      expect(externalEvents[0]).toMatchInlineSnapshot(`
        {
          "id": "2004",
          "timestamp": 1643673600000,
          "type": "play",
        }
      `);
    });
  });
});

describe("IncrementalCounter", () => {
  const keys = [
    "errors",
    "stalled_count",
    "waiting_count",
    "time_errored_ms",
    "time_stalled_ms",
    "time_playing_ms",
    "time_waiting_ms",
  ] as const;

  let counter: IncrementalCounter<(typeof keys)[number]>;

  beforeEach(() => {
    counter = new IncrementalCounter([...keys]);
  });

  it("initializes counts to 0 for all keys", () => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    keys.forEach((key) => {
      expect(counter.calculateIncrement(key, 0)).toBe(0);
    });
  });

  it("correctly calculates increments for a given key", () => {
    const increments = {
      errors: 5,
      stalled_count: 2,
      waiting_count: 3,
      time_errored_ms: 1000,
      time_stalled_ms: 500,
      time_playing_ms: 1500,
      time_waiting_ms: 250,
    };

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.entries(increments).forEach(([key, value]) => {
      expect(
        counter.calculateIncrement(key as keyof typeof increments, value),
      ).toBe(value);
      // Subsequent check to ensure the increment is 0 if the same value is passed again
      expect(
        counter.calculateIncrement(key as keyof typeof increments, value),
      ).toBe(0);
    });
  });

  it("returns 0 for increment if newCount is less than the current count", () => {
    // Manually setting an initial count higher than what we will test with
    counter.calculateIncrement("errors", 10);
    // Testing with a lower newCount should return 0
    expect(counter.calculateIncrement("errors", 5)).toBe(0);
  });
});

describe("ValueChangeTracker", () => {
  // Define the keys you'll be testing with. These should be valid keys of the HeartbeatEvent type.
  const keys: (keyof HeartbeatEvent)[] = [
    "errors",
    "time_playing_ms",
    "autoplay_status",
  ];

  it("returns the new value when a value changes", () => {
    const tracker = new ValueChangeTracker(keys);
    const newValue = 10; // Example new value for 'errors'
    expect(tracker.sendIfChanged("errors", newValue)).toBe(newValue);
  });

  it("returns undefined if the value has not changed", () => {
    const tracker = new ValueChangeTracker(keys);
    const initialValue = 5;
    tracker.sendIfChanged("errors", initialValue); // Set an initial value
    expect(tracker.sendIfChanged("errors", initialValue)).toBeUndefined(); // Try to set the same value again
  });

  it("tracks changes across multiple keys", () => {
    const tracker = new ValueChangeTracker(keys);
    const errorsValue = 1;
    const playingTimeValue = 1000;
    // Send initial values
    tracker.sendIfChanged("errors", errorsValue);
    tracker.sendIfChanged("time_playing_ms", playingTimeValue);
    // Expect new values to be returned when they change
    expect(tracker.sendIfChanged("errors", errorsValue + 1)).toBe(
      errorsValue + 1,
    );
    expect(
      tracker.sendIfChanged("time_playing_ms", playingTimeValue + 100),
    ).toBe(playingTimeValue + 100);
    // Expect undefined for unchanged values
    expect(tracker.sendIfChanged("autoplay_status", "autoplay")).toBe(
      "autoplay",
    ); // Assuming this is the first set
    expect(
      tracker.sendIfChanged("autoplay_status", "autoplay"),
    ).toBeUndefined();
  });
});
