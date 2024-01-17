import { expect, it } from "vitest";

import * as Exports from "./browser";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "addEventListeners",
      "addMediaMetrics",
      "canPlayMediaNatively",
      "getDeviceInfo",
      "isPictureInPictureSupported",
    ]
  `);
});
