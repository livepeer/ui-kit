import { describe, expect, it } from 'vitest';

import { createMetricsReportingUrl } from './utils';

describe('createMetricsReportingUrl', () => {
  describe('asset url', () => {
    it('given a valid url then it should return a reporting url', () => {
      // Given
      const sourceUrl =
        'https://livepeercdn.com/hls/172159gos7h0pq17/index.m3u8';
      // When
      const reportingUrl = createMetricsReportingUrl(sourceUrl);
      // Then
      expect(reportingUrl).toEqual(
        'wss://nyc-canary-catalyst-0.livepeer.fun/json_video+172159gos7h0pq17.js',
      );
    });

    it('given invalid urls then it should not return a reporting urls', () => {
      // Given
      const sourceUrls = [
        'https://livepeercdn.com/dash/172159gos7h0pq17/index.m3u8',
        'https://livepeercdn.com/hls/172159gos7h0pq17/master.m3u8',
      ];
      // When
      const reportingUrls = sourceUrls.map((url) =>
        createMetricsReportingUrl(url),
      );
      // Then
      expect(reportingUrls).toEqual([undefined, undefined]);
    });
  });

  describe('recording url', () => {
    it('given a valid url then it should return a reporting url', () => {
      // Given
      const sourceUrl =
        'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8';
      // When
      const reportingUrl = createMetricsReportingUrl(sourceUrl);
      // Then
      expect(reportingUrl).toEqual(
        'wss://nyc-canary-catalyst-0.livepeer.fun/json_video+c34af47b-bbf2-40ed-ad2d-77abd43860c9.js',
      );
    });

    it('given invalid urls then it should not return a reporting urls', () => {
      // Given
      const sourceUrls = [
        'https://livepeercdn.com/static/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8',
        'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/master.m3u8',
      ];
      // When
      const reportingUrls = sourceUrls.map((url) =>
        createMetricsReportingUrl(url),
      );
      // Then
      expect(reportingUrls).toEqual([undefined, undefined]);
    });
  });
});
