import { describe, expect, it } from "vitest";

import { HttpError } from "./errors";

describe("HttpError", () => {
  it("creates", () => {
    expect(new HttpError(201, "some message")).toBeInstanceOf(HttpError);
  });
});
