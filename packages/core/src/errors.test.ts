import { expect, it } from "vitest";

import * as Exports from "./errors";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "ACCESS_CONTROL_ERROR_MESSAGE",
      "BFRAMES_ERROR_MESSAGE",
      "NOT_ACCEPTABLE_ERROR_MESSAGE",
      "PERMISSIONS_ERROR_MESSAGE",
      "STREAM_OFFLINE_ERROR_MESSAGE",
      "STREAM_OPEN_ERROR_MESSAGE",
      "isAccessControlError",
      "isBframesError",
      "isNotAcceptableError",
      "isPermissionsError",
      "isStreamOfflineError",
    ]
  `);
});
