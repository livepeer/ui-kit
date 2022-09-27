import { beforeAll, describe, expect, it } from 'vitest';

import {
  MockedVideoElement,
  setupClient,
  waitForWebsocketOpen,
} from '../../../test';

import { reportMediaMetrics } from './metrics';
import { getMetricsReportingUrl } from './utils';

// const assetId = 'ec4cb9ca-cebe-4b41-a263-1ba4aa7cb695';
const playbackUrl =
  'https://livepeercdn.com/recordings/9b8a9c59-e5c6-4ba8-9f88-e400b0f9153f/index.m3u8';

describe('reportMediaMetrics', () => {
  beforeAll(() => {
    setupClient();
  });

  describe('event listeners', () => {
    it('registers listeners', async () => {
      const reportingUrl = await getMetricsReportingUrl(playbackUrl);

      const element = new MockedVideoElement();

      const { metrics } = reportMediaMetrics(element, reportingUrl ?? '');

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

    it('should initialize to base state', async () => {
      const reportingUrl = await getMetricsReportingUrl(playbackUrl);

      const element = new MockedVideoElement();

      const { metrics } = reportMediaMetrics(element, reportingUrl ?? '');

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
      const reportingUrl = await getMetricsReportingUrl(playbackUrl);

      const element = new MockedVideoElement();

      const { metrics, websocket } = reportMediaMetrics(
        element,
        reportingUrl ?? '',
      );

      await waitForWebsocketOpen(websocket);

      element.dispatchEvent(new Event('playing'));

      const metricsSnapshot = metrics?.getMetrics();

      expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
        {
          "firstPlayback": 213000,
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
      const reportingUrl = await getMetricsReportingUrl(playbackUrl);

      const element = new MockedVideoElement();

      const { metrics } = reportMediaMetrics(element, reportingUrl ?? '');

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
      const reportingUrl = await getMetricsReportingUrl(playbackUrl);

      const element = new MockedVideoElement();

      const { metrics } = reportMediaMetrics(element, reportingUrl ?? '');

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
