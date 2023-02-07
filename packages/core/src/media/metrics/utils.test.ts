import { describe, expect, it } from 'vitest';

import { getMetricsReportingUrl } from './utils';

describe('getMetricsReportingUrl', () => {
  describe('asset url', () => {
    it('given a valid url then it should return a reporting url', async () => {
      const sourceUrl =
        'https://livepeercdn.com/hls/172159gos7h0pq17/index.m3u8';

      const reportingUrl = await getMetricsReportingUrl(sourceUrl);

      expect(reportingUrl).toContain(
        '.lp-playback.studio/json_video+172159gos7h0pq17.js',
      );
    });

    it('given a valid metrics url then it should return a reporting url', async () => {
      const sourceUrl =
        'https://asset-cdn.lp-playback.studio/hls/172159gos7h0pq17/index.m3u8';

      const reportingUrl = await getMetricsReportingUrl(sourceUrl);

      expect(reportingUrl).toContain(
        '.lp-playback.studio/json_video+172159gos7h0pq17.js',
      );
    });

    it('given invalid urls then it should not return a reporting urls', async () => {
      const sourceUrls = [
        'https://livecdn.com/dash/172159gos7h0pq17/index.m3u8',
        'https://livecdn.com/hls/172159gos7h0pq17/master.m3u8',
      ];

      const reportingUrls = await Promise.all(
        sourceUrls.map(async (url) => getMetricsReportingUrl(url)),
      );

      expect(reportingUrls).toEqual([null, null]);
    });
  });

  describe('recording url', () => {
    it('given a valid url then it should return a reporting url', async () => {
      const sourceUrl =
        'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8';

      const reportingUrl = await getMetricsReportingUrl(sourceUrl);

      expect(reportingUrl).toContain(
        '.lp-playback.studio/json_video+c34af47b-bbf2-40ed-ad2d-77abd43860c9.js',
      );
    });

    it('given invalid urls then it should not return a reporting urls', async () => {
      const sourceUrls = [
        'https://livecdn.com/static/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8',
        'https://livecdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/master.m3u8',
      ];

      const reportingUrls = await Promise.all(
        sourceUrls.map(async (url) => await getMetricsReportingUrl(url)),
      );

      expect(reportingUrls).toEqual([null, null]);
    });
  });
});
