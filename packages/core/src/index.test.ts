import { expect, it } from "vitest";

import * as Exports from "./";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "ACCESS_CONTROL_ERROR_MESSAGE",
      "BFRAMES_ERROR_MESSAGE",
      "NOT_ACCEPTABLE_ERROR_MESSAGE",
      "STREAM_OFFLINE_ERROR_MESSAGE",
      "STREAM_OPEN_ERROR_MESSAGE",
      "b64Decode",
      "b64Encode",
      "b64UrlDecode",
      "b64UrlEncode",
      "createControllerStore",
      "createStorage",
      "deepMerge",
      "getMediaSourceType",
      "isAccessControlError",
      "isBframesError",
      "isNotAcceptableError",
      "isStreamOfflineError",
      "noopStorage",
      "omit",
      "pick",
      "sanitizeMediaControllerState",
      "version",
    ]
  `);
});
