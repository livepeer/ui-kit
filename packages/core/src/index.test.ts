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
      "clearClient",
      "Client",
      "createClient",
      "defaultStudioConfig",
      "defaultTranscodingProfiles",
      "HttpError",
      "addMediaMetrics",
      "canPlayMediaNatively",
      "getMediaSourceType",
      "MetricsStatus",
      "PlaybackMonitor",
      "createStorage",
      "noopStorage",
      "b64UrlDecode",
      "b64UrlEncode",
      "deepMerge",
      "pick",
    ]
  `);
});
