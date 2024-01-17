import { expect, it } from "vitest";

import * as Exports from "./controls";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "useBaseSlider",
      "useBroadcast",
      "useClipButton",
      "useControlsContainer",
      "useFullscreenButton",
      "usePlayButton",
      "usePlayer",
      "useProgress",
      "useTimeDisplay",
      "useVolume",
    ]
  `);
});
