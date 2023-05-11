import { expect, it } from 'vitest';

// eslint-disable-next-line import/namespace
import * as Exports from '.';

it('should expose correct exports', () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "ACCESS_CONTROL_ERROR_MESSAGE",
      "Client",
      "HttpError",
      "STREAM_OFFLINE_ERROR_MESSAGE",
      "STREAM_OPEN_ERROR_MESSAGE",
      "b64Decode",
      "b64Encode",
      "b64UrlDecode",
      "b64UrlEncode",
      "clearClient",
      "createAsset",
      "createClient",
      "createControllerStore",
      "createStorage",
      "createStream",
      "deepMerge",
      "defaultStudioConfig",
      "defaultTranscodingProfiles",
      "getAsset",
      "getAssetMetrics",
      "getLivepeerProvider",
      "getMediaSourceType",
      "getPlaybackInfo",
      "getStream",
      "getStreamSession",
      "getStreamSessions",
      "isAccessControlError",
      "isStreamOfflineError",
      "noopStorage",
      "omit",
      "pick",
      "updateAsset",
      "updateStream",
      "watchLivepeerProvider",
    ]
  `);
});
