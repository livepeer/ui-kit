import { describe, expect, it } from 'vitest';

import { createMetricsReportingUrl } from './utils';

describe('createMetricsReportingUrl', () => {
  it('given an asset url then it creates a correct reporting url correctly', () => {
    // Given
    const sourceUrl = 'https://livepeercdn.com/hls/172159gos7h0pq17/index.m3u8';
    // When
    const reportingUrl = createMetricsReportingUrl(sourceUrl);
    // Then
    expect(reportingUrl).toEqual(
      'wss://playback.livepeer.fun/json_video+172159gos7h0pq17.js',
    );
  });

  it('given a recording url then it creates a correct reporting url correctly', () => {
    // Given
    const sourceUrl =
      'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8';
    // When
    const reportingUrl = createMetricsReportingUrl(sourceUrl);
    // Then
    expect(reportingUrl).toEqual(
      'wss://playback.livepeer.fun/json_video+c34af47b-bbf2-40ed-ad2d-77abd43860c9.js',
    );
  });
});
