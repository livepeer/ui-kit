import { expect, it } from 'vitest';

import * as Exports from './';

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "createAsset",
      "createStream",
      "getAsset",
      "getAssetMetrics",
      "getLivepeerProvider",
      "getPlaybackInfo",
      "getStream",
      "getStreamSession",
      "getStreamSessions",
      "updateAsset",
      "updateStream",
      "watchLivepeerProvider",
      "defaultStudioConfig",
      "defaultTranscodingProfiles",
      "HttpError",
      "addMediaMetrics",
      "canPlayMediaNatively",
      "getMediaSourceType",
      "getMetricsReportingUrl",
      "MetricsStatus",
      "PlaybackMonitor",
      "createStorage",
      "noopStorage",
      "deepMerge",
      "pick",
    ]
  `);
});
