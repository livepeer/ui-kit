import { expect, it } from "vitest";

import * as Exports from "./broadcast";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "addBroadcastEventListeners",
      "createBroadcastStore",
      "getBroadcastDeviceInfo",
    ]
  `);
});
