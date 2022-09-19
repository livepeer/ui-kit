import { beforeAll, describe, expect, it } from 'vitest';

import { MockedVideoElement, setupClient } from '../../../test';
import { getMetricsReportingUrl, reportVideoMetrics } from '../../video';
import { getMetrics } from './getMetrics';

// const playbackId = '373d7a8kibjpsi0d';
const assetId = '373d4737-6e23-4b39-b37c-bcd4e72735e2';
const playbackUrl =
  'https://livepeercdn.com/recordings/06a55df1-a0bd-4ffd-8a1f-831231145359/index.m3u8';

describe('getMetrics', () => {
  beforeAll(() => {
    setupClient();
  });

  it('mounts', async () => {
    const reportingUrl = await getMetricsReportingUrl(playbackUrl);

    const element = new MockedVideoElement();

    const { metrics, report, websocket } = reportVideoMetrics(
      element,
      reportingUrl ?? '',
    );

    console.log({ reportingUrl });

    await new Promise<void>((resolve) => {
      websocket?.addEventListener('open', () => {
        resolve();
      });
    });

    element.dispatchEvent(new Event('playing'));

    const metricsSnapshot = metrics?.getMetrics();

    expect(metricsSnapshot?.current).toMatchInlineSnapshot(`
      {
        "firstPlayback": 38000,
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

    report?.();

    const assetMetrics = await getMetrics({ assetId });

    expect(assetMetrics).toMatchInlineSnapshot(`
      {
        "0": {
          "id": "373d7a8kibjpsi0d",
          "startViews": 3,
        },
      }
    `);
  });
});
