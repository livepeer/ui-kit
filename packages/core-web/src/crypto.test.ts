import { expect, it } from "vitest";

import * as Exports from "./crypto";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "importPKCS8",
      "signAccessJwt",
    ]
  `);
});
