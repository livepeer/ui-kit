import { beforeAll, describe, expect, it } from 'vitest';

import { addMediaMetrics } from './metrics';
import { MockedVideoElement, resetDateNow, setupClient } from '../../../test';

const playbackUrl =
  'https://livepeercdn.com/recordings/9b8a9c59-e5c6-4ba8-9f88-e400b0f9153f/index.m3u8';

describe('addMediaMetrics', () => {
  beforeAll(() => {
    setupClient();
    resetDateNow();
  });

  describe('event listeners', () => {
    it('registers listeners', async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element, playbackUrl);

      expect(metrics).toBeTruthy;
      expect(element.setAttribute).toHaveBeenCalledTimes(2);
      expect(
        element.addEventListener.mock.calls.map((e) => e?.[0]),
      ).toMatchInlineSnapshot(
        `
        [
          "volumechange",
          "canplay",
          "play",
          "pause",
          "durationchange",
          "timeupdate",
          "error",
          "waiting",
          "stalled",
          "loadstart",
          "resize",
          "keyup",
          "mouseenter",
          "mouseleave",
          "mousemove",
          "touchstart",
          "touchend",
          "touchmove",
        ]
      `,
      );
    });

    it('should initialize to base state', async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element, playbackUrl);

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent)
        metricsSnapshot.current.userAgent = 'UA';

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "autoplay": "preload-metadata",
          "duration": 0,
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "http://localhost:3000/",
          "playbackScore": null,
          "player": "livepeer-js",
          "playerHeight": null,
          "playerWidth": null,
          "preloadTime": 0,
          "protocol": "application/vnd.apple.mpegurl",
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 0,
          "ttff": 0,
          "userAgent": "UA",
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });

    it('should update time unpaused and first playback', async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element, playbackUrl);

      element.dispatchEvent(new Event('playing'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent)
        metricsSnapshot.current.userAgent = 'UA';

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
      {
        "autoplay": "preload-metadata",
        "duration": 0,
        "firstPlayback": 0,
        "nError": 0,
        "nStalled": 0,
        "nWaiting": 0,
        "pageUrl": "http://localhost:3000/",
        "playbackScore": null,
        "player": "livepeer-js",
        "playerHeight": null,
        "playerWidth": null,
        "preloadTime": 0,
        "protocol": "application/vnd.apple.mpegurl",
        "sourceUrl": "",
        "timeStalled": 0,
        "timeUnpaused": 0,
        "timeWaiting": 0,
        "ttff": 0,
        "userAgent": "UA",
        "videoHeight": null,
        "videoWidth": null,
      }
    `);
    });

    it('should update time waiting and waiting count', async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element, playbackUrl);

      element.dispatchEvent(new Event('waiting'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent)
        metricsSnapshot.current.userAgent = 'UA';

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
          {
            "autoplay": "preload-metadata",
            "duration": 0,
            "firstPlayback": 0,
            "nError": 0,
            "nStalled": 0,
            "nWaiting": 1,
            "pageUrl": "http://localhost:3000/",
            "playbackScore": null,
            "player": "livepeer-js",
            "playerHeight": null,
            "playerWidth": null,
            "preloadTime": 0,
            "protocol": "application/vnd.apple.mpegurl",
            "sourceUrl": "",
            "timeStalled": 0,
            "timeUnpaused": 0,
            "timeWaiting": 1000,
            "ttff": 0,
            "userAgent": "UA",
            "videoHeight": null,
            "videoWidth": null,
          }
        `);
    });

    it('should update time stalled and stalled count', async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element, playbackUrl);

      expect(element.dispatchEvent.mock.calls).toMatchInlineSnapshot('[]');

      element.dispatchEvent(new Event('stalled'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current?.userAgent).toBeTruthy();

      if (metricsSnapshot?.current?.userAgent)
        metricsSnapshot.current.userAgent = 'UA';

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
                  {
                    "autoplay": "preload-metadata",
                    "duration": 0,
                    "firstPlayback": 0,
                    "nError": 0,
                    "nStalled": 1,
                    "nWaiting": 0,
                    "pageUrl": "http://localhost:3000/",
                    "playbackScore": null,
                    "player": "livepeer-js",
                    "playerHeight": null,
                    "playerWidth": null,
                    "preloadTime": 0,
                    "protocol": "application/vnd.apple.mpegurl",
                    "sourceUrl": "",
                    "timeStalled": 1000,
                    "timeUnpaused": 0,
                    "timeWaiting": 0,
                    "ttff": 0,
                    "userAgent": "UA",
                    "videoHeight": null,
                    "videoWidth": null,
                  }
                `);
    });
  });
});
