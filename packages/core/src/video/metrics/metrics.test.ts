import { describe, expect, it } from 'vitest';

import { MockedVideoElement } from '../../../test';

import { reportVideoMetrics } from './metrics';

describe('reportVideoMetrics', () => {
  it('registers listeners', () => {
    const element = new MockedVideoElement();

    const { metrics } = reportVideoMetrics(
      element,
      'wss://livepeer.fun/json+1234.js',
    );

    expect(metrics).toBeTruthy;
    expect(element.setAttribute).toHaveBeenCalledOnce();
    expect(
      element.addEventListener.mock.calls.map((e) => e?.[0]),
    ).toMatchInlineSnapshot(
      `
      [
        "waiting",
        "stalled",
        "playing",
        "pause",
        "playing",
        "pause",
        "playing",
        "waiting",
        "stalled",
        "error",
        "loadstart",
        "play",
        "playing",
        "loadeddata",
        "pause",
        "abort",
        "emptied",
        "ended",
        "seeking",
        "seeked",
        "ratechange",
      ]
    `,
    );
  });

  describe('reports', () => {
    it('should initialize to base state', async () => {
      const element = new MockedVideoElement();

      const { metrics } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": 0,
          "playerWidth": 0,
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

      const { metrics } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      element.dispatchEvent(new Event('playing'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "firstPlayback": 32000,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": 0,
          "playerWidth": 0,
          "sourceUrl": "",
          "timeStalled": 0,
          "timeUnpaused": 2000,
          "timeWaiting": 0,
          "videoHeight": null,
          "videoWidth": null,
        }
      `);
    });

    it('should update time waiting and waiting count', async () => {
      const element = new MockedVideoElement();

      const { metrics } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      element.dispatchEvent(new Event('waiting'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 0,
          "nWaiting": 1,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": 0,
          "playerWidth": 0,
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

      const { metrics } = reportVideoMetrics(
        element,
        'wss://livepeer.fun/json+1234.js',
      );

      expect(element.dispatchEvent.mock.calls).toMatchInlineSnapshot('[]');

      element.dispatchEvent(new Event('stalled'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "firstPlayback": 0,
          "nError": 0,
          "nStalled": 1,
          "nWaiting": 0,
          "pageUrl": "",
          "playbackScore": null,
          "player": "generic",
          "playerHeight": 0,
          "playerWidth": 0,
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
