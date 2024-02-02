import { expect, it } from "vitest";

import * as Exports from "./crypto";

globalThis.crypto = crypto as Crypto;
globalThis.window.crypto = crypto as Crypto;

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "importPKCS8",
      "signAccessJwt",
    ]
  `);
});
