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
      "createControllerStore",
      "getMediaSourceType",
      "createStorage",
      "noopStorage",
      "b64Decode",
      "b64Encode",
      "b64UrlDecode",
      "b64UrlEncode",
      "deepMerge",
      "pick",
    ]
  `);
});
