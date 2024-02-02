import { expect, it } from "vitest";

import * as Exports from "./media";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "createControllerStore",
      "getMediaSourceType",
    ]
  `);
});
