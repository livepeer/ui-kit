import { beforeAll, describe, expect, it } from "vitest";

import { MockedVideoElement, resetDateNow } from "../../test";
import { addMediaMetrics } from "./metrics";

describe("addMediaMetrics", () => {
  beforeAll(() => {
    resetDateNow();
  });

  describe("event listeners", () => {
    it("should initialize to base state", async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element);

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent) {
        metricsSnapshot.current.userAgent = "UA";
        metricsSnapshot.current.player = "hls-1";
      }

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "autoplay": "preload-full",
          "duration": null,
          "firstPlayback": null,
          "nError": null,
          "nStalled": 0,
          "nWaiting": 0,
          "offset": null,
          "pageUrl": "http://localhost:3000/",
          "playbackScore": null,
          "player": "hls-1",
          "playerHeight": null,
          "playerWidth": null,
          "preloadTime": null,
          "sourceType": "unknown",
          "sourceUrl": null,
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 0,
          "ttff": null,
          "uid": "",
          "userAgent": "UA",
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });

    it("should update time unpaused and first playback", async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element);

      element.dispatchEvent(new Event("playing"));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent) {
        metricsSnapshot.current.userAgent = "UA";
        metricsSnapshot.current.player = "hls-1";
      }

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "autoplay": "preload-full",
          "duration": null,
          "firstPlayback": 8000,
          "nError": null,
          "nStalled": 0,
          "nWaiting": 0,
          "offset": null,
          "pageUrl": "http://localhost:3000/",
          "playbackScore": null,
          "player": "hls-1",
          "playerHeight": null,
          "playerWidth": null,
          "preloadTime": null,
          "sourceType": "unknown",
          "sourceUrl": null,
          "timeStalled": 0,
          "timeUnpaused": 2000,
          "timeWaiting": 0,
          "ttff": null,
          "uid": "",
          "userAgent": "UA",
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });

    it("should update time waiting and waiting count", async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element);

      element.dispatchEvent(new Event("waiting"));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent) {
        metricsSnapshot.current.userAgent = "UA";
        metricsSnapshot.current.player = "hls-1";
      }

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "autoplay": "preload-full",
          "duration": null,
          "firstPlayback": null,
          "nError": null,
          "nStalled": 0,
          "nWaiting": 1,
          "offset": null,
          "pageUrl": "http://localhost:3000/",
          "playbackScore": null,
          "player": "hls-1",
          "playerHeight": null,
          "playerWidth": null,
          "preloadTime": null,
          "sourceType": "unknown",
          "sourceUrl": null,
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 1000,
          "ttff": null,
          "uid": "",
          "userAgent": "UA",
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });

    it("should update time stalled and stalled count", async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element);

      expect(element.dispatchEvent.mock.calls).toMatchInlineSnapshot("[]");

      element.dispatchEvent(new Event("stalled"));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent) {
        metricsSnapshot.current.userAgent = "UA";
        metricsSnapshot.current.player = "hls-1";
      }

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "autoplay": "preload-full",
          "duration": null,
          "firstPlayback": null,
          "nError": null,
          "nStalled": 1,
          "nWaiting": 0,
          "offset": null,
          "pageUrl": "http://localhost:3000/",
          "playbackScore": null,
          "player": "hls-1",
          "playerHeight": null,
          "playerWidth": null,
          "preloadTime": null,
          "sourceType": "unknown",
          "sourceUrl": null,
          "timeStalled": 1000,
          "timeUnpaused": 0,
          "timeWaiting": 0,
          "ttff": null,
          "uid": "",
          "userAgent": "UA",
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });
  });

  it("should replace user agent special characters", async () => {
    const element = new MockedVideoElement();

    // biome-ignore lint/suspicious/noExplicitAny: any
    (navigator as any)?.__defineGetter__?.(
      "userAgent",
      () =>
        '\\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36"',
    );

    const { metrics } = addMediaMetrics(element);

    const metricsSnapshot = metrics?.getMetrics();

    expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

    if (metricsSnapshot?.current?.player) {
      metricsSnapshot.current.player = "hls-1";
    }

    expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
      {
        "autoplay": "preload-full",
        "duration": null,
        "firstPlayback": null,
        "nError": null,
        "nStalled": 0,
        "nWaiting": 0,
        "offset": null,
        "pageUrl": "http://localhost:3000/",
        "playbackScore": null,
        "player": "hls-1",
        "playerHeight": null,
        "playerWidth": null,
        "preloadTime": null,
        "sourceType": "unknown",
        "sourceUrl": null,
        "timeStalled": 0,
        "timeUnpaused": 0,
        "timeWaiting": 0,
        "ttff": null,
        "uid": "",
        "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36",
        "videoHeight": null,
        "videoWidth": null,
      }
    `);
  });
});
