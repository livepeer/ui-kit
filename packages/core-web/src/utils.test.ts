import { expect, it } from "vitest";

import * as Exports from "./utils";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "b64Decode",
      "b64Encode",
      "b64UrlDecode",
      "b64UrlEncode",
      "deepMerge",
      "noop",
      "omit",
      "parseArweaveTxId",
      "parseCid",
      "pick",
      "warn",
    ]
  `);
});
