import { expect, it } from "vitest";

import * as Exports from "./context";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "MediaProvider",
      "createMediaScope",
      "useMediaContext",
      "useStore",
    ]
  `);
});
