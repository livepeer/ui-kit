import { describe, expect, it } from 'vitest';

import { createMetricsReportingUrl } from './utils';

describe('createMetricsReportingUrl', () => {
  it('creates', () => {
    const url = createMetricsReportingUrl(
      'https://livepeercdn.com/recordings/c34af47b-bbf2-40ed-ad2d-77abd43860c9/index.m3u8',
    );

    expect(url).toMatchInlineSnapshot(
      '"wss://sao-canary-catalyst-0.livepeer.fun/json_video+c34af47b-bbf2-40ed-ad2d-77abd43860c9.js"',
    );
  });
});
