import { expect, it } from "vitest";

import * as Exports from "./external";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "getIngest",
      "getSrc",
    ]
  `);
});
