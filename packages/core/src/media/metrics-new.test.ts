import { describe, expect, it } from "vitest";

import { PlaybackEvent, PlaybackEventBuffer } from "./metrics-new";

const getDummyPlaybackEvent = (
  type: "heartbeat" | "error" = "heartbeat",
): PlaybackEvent =>
  type === "heartbeat"
    ? {
        timestamp: Date.now(),
        type,
        errors: 0,
        autoplay_status: "autoplay",
        buffer_ms: 1000,
        playtime_ms: 5000,
        preload_time_ms: 1000,
      }
    : {
        timestamp: Date.now(),
        type,
        error_message: "Big error",
      };

describe("PlaybackEventBuffer", () => {
  describe("max length", () => {
    it("adds and retrieves single event", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent());

      const events = buffer.getEvents();

      expect(events).toMatchInlineSnapshot(`
        [
          {
            "autoplay_status": "autoplay",
            "buffer_ms": 1000,
            "errors": 0,
            "playtime_ms": 5000,
            "preload_time_ms": 1000,
            "timestamp": 1643673600000,
            "type": "heartbeat",
          },
        ]
      `);
    });

    it("adds and enqueues on failure", async () => {
      const buffer = new PlaybackEventBuffer();

      buffer.addEvent(getDummyPlaybackEvent());

      const events = buffer.getEvents();

      expect(buffer.getEvents()).length(0);
      expect(buffer.getEvents()).length(0);

      buffer.onFailure(events);

      expect(buffer.getEvents()).toMatchInlineSnapshot(`
        [
          {
            "autoplay_status": "autoplay",
            "buffer_ms": 1000,
            "errors": 0,
            "playtime_ms": 5000,
            "preload_time_ms": 1000,
            "timestamp": 1643673600000,
            "type": "heartbeat",
          },
        ]
      `);
    });

    it("adds a lot of events and caps at max", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      expect(buffer.getEvents()).length(buffer.maxBufferSize);
    });

    it("adds a lot of events and enqueues new ones to front", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      buffer.addEvent(getDummyPlaybackEvent("error"));

      expect(buffer.getEvents()[0]).toMatchInlineSnapshot(`
        {
          "autoplay_status": "autoplay",
          "buffer_ms": 1000,
          "errors": 0,
          "playtime_ms": 5000,
          "preload_time_ms": 1000,
          "timestamp": 1643673600000,
          "type": "heartbeat",
        }
      `);
    });

    it("adds a lot of events and enqueues errored ones to back", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 10; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      buffer.onFailure([getDummyPlaybackEvent("error")]);

      const events = buffer.getEvents();

      expect(events).length(11);

      expect(events[events.length - 1]).toMatchInlineSnapshot(`
        {
          "error_message": "Big error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
      expect(events[0]).toMatchInlineSnapshot(`
        {
          "autoplay_status": "autoplay",
          "buffer_ms": 1000,
          "errors": 0,
          "playtime_ms": 5000,
          "preload_time_ms": 1000,
          "timestamp": 1643673600000,
          "type": "heartbeat",
        }
      `);
    });

    it("adds a lot of events and errored get trimmed", async () => {
      const buffer = new PlaybackEventBuffer();

      for (let i = 0; i < 1000; i++) {
        buffer.addEvent(getDummyPlaybackEvent());
      }

      buffer.onFailure([getDummyPlaybackEvent("error")]);

      const events = buffer.getEvents();

      expect(events).length(buffer.maxBufferSize);

      expect(events[events.length - 1]).toMatchInlineSnapshot(`
        {
          "error_message": "Big error",
          "timestamp": 1643673600000,
          "type": "error",
        }
      `);
      expect(events[0]).toMatchInlineSnapshot(`
        {
          "autoplay_status": "autoplay",
          "buffer_ms": 1000,
          "errors": 0,
          "playtime_ms": 5000,
          "preload_time_ms": 1000,
          "timestamp": 1643673600000,
          "type": "heartbeat",
        }
      `);
    });
  });
});
