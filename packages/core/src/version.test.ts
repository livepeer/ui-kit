import { expect, it } from "vitest";

import * as Exports from "./version";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "version",
    ]
  `);
});
