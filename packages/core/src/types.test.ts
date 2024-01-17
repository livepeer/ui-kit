import { expect, it } from "vitest";

import * as Exports from "./types";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot("[]");
});
