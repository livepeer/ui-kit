import { beforeEach, describe, expect, it } from "vitest";

import {
  type HeartbeatEvent,
  IncrementalCounter,
  type PlaybackEvent,
  PlaybackEventBuffer,
  ValueChangeTracker,
} from "./metrics-new";

const getDummyPlaybackEvent = (
  type: "heartbeat" | "error" = "heartbeat",
): PlaybackEvent =>
  type === "heartbeat"
    ? {
        id: "abcd1234",
        timestamp: Date.now(),
        type,
        errors: 0,
        warnings: 0,
        autoplay_status: "autoplay",
        stalled_count: 1,
        waiting_count: 0,
        time_warning_ms: 0,
        time_errored_ms: 0,
        time_playing_ms: 5000,
        time_stalled_ms: 0,
        time_waiting_ms: 0,
      }
    : {
        id: "abcd1234",
        timestamp: Date.now(),
        type,
        message: "Error",
        category: "access-control",
      };

describe("PlaybackEventBuffer", () => {
  describe("max length", () => {
    it("adds and retrieves single event", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent());

      const events = buffer.getExternalEvents();

      expect(events).toMatchInlineSnapshot(`
        [
          {
            "autoplay_status": "autoplay",
            "errors": 0,
            "stalled_count": 1,
            "time_errored_ms": 0,
            "time_playing_ms": 5000,
            "time_stalled_ms": 0,
            "time_waiting_ms": 0,
            "time_warning_ms": 0,
            "timestamp": 1643673600000,
            "type": "heartbeat",
            "waiting_count": 0,
            "warnings": 0,
          },
        ]
      `);
    });

    it("adds and enqueues on failure", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent());

      const events = buffer.getExternalEvents();

      expect(buffer.getExternalEvents()).length(0);
      expect(buffer.getExternalEvents()).length(0);

      buffer.onExternalFailure(events);

      expect(buffer.getExternalEvents()).toMatchInlineSnapshot(`
        [
          {
            "autoplay_status": "autoplay",
            "errors": 0,
            "stalled_count": 1,
            "time_errored_ms": 0,
            "time_playing_ms": 5000,
            "time_stalled_ms": 0,
            "time_waiting_ms": 0,
            "time_warning_ms": 0,
            "timestamp": 1643673600000,
            "type": "heartbeat",
            "waiting_count": 0,
            "warnings": 0,
          },
        ]
      `);
    });

    it("adds a lot of events and caps at max", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < buffer.maxBufferSize + 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      expect(buffer.getExternalEvents()).length(buffer.maxBufferSize);
    });

    it("adds a lot of events and enqueues new ones to front", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      buffer.addEvent(getDummyPlaybackEvent("error"));

      expect(buffer.getExternalEvents()[0]).toMatchInlineSnapshot(`
        {
          "category": "access-control",
          "message": "Error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
    });

    it("adds a lot of events and enqueues errored ones to back", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 10; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      buffer.onExternalFailure([getDummyPlaybackEvent("error")]);

      const events = buffer.getExternalEvents();

      expect(events).length(11);

      expect(events[events.length - 1]).toMatchInlineSnapshot(`
        {
          "category": "access-control",
          "message": "Error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
      expect(events[0]).toMatchInlineSnapshot(`
        {
          "autoplay_status": "autoplay",
          "errors": 0,
          "stalled_count": 1,
          "time_errored_ms": 0,
          "time_playing_ms": 5000,
          "time_stalled_ms": 0,
          "time_waiting_ms": 0,
          "time_warning_ms": 0,
          "timestamp": 1643673600000,
          "type": "heartbeat",
          "waiting_count": 0,
          "warnings": 0,
        }
      `);
    });

    it("adds a lot of events and errored get trimmed", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < buffer.maxBufferSize + 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      buffer.onExternalFailure([getDummyPlaybackEvent("error")]);

      const externalEvents = buffer.getExternalEvents();
      const internalEvents = buffer.getInternalEvents();

      expect(externalEvents).length(buffer.maxBufferSize);
      expect(internalEvents).length(buffer.maxBufferSize);

      expect(externalEvents[externalEvents.length - 1]).toMatchInlineSnapshot(`
        {
          "category": "access-control",
          "message": "Error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
      expect(externalEvents[0]).toMatchInlineSnapshot(`
        {
          "autoplay_status": "autoplay",
          "errors": 0,
          "stalled_count": 1,
          "time_errored_ms": 0,
          "time_playing_ms": 5000,
          "time_stalled_ms": 0,
          "time_waiting_ms": 0,
          "time_warning_ms": 0,
          "timestamp": 1643673600000,
          "type": "heartbeat",
          "waiting_count": 0,
          "warnings": 0,
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
