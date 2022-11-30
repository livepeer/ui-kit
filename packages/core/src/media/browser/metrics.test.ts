import { beforeAll, describe, expect, it } from 'vitest';

import { MockedVideoElement, resetDateNow, setupClient } from '../../../test';
import { addMediaMetrics } from './metrics';

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
        ]
      `,
      );
    });

    it('should initialize to base state', async () => {
      const element = new MockedVideoElement();

      const { metrics } = addMediaMetrics(element, playbackUrl);

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "duration": 0,
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": null,
          "playerWidth": null,
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 0,
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

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "duration": 0,
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": null,
          "playerWidth": null,
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 0,
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

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "duration": 0,
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 1,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": null,
          "playerWidth": null,
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 0,
          "timeWaiting": 1000,
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

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "duration": 0,
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 1,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": null,
          "playerWidth": null,
          "sourceUrl": "",
          "timeStalled": 1000,
          "timeUnpaused": 0,
          "timeWaiting": 0,
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });
  });
});
