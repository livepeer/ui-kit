import { expect, it } from "vitest";

import * as Exports from "./player";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "ClipTrigger",
      "Container",
      "Controls",
      "ErrorIndicator",
      "FullscreenIndicator",
      "FullscreenTrigger",
      "LiveIndicator",
      "LoadingIndicator",
      "MuteTrigger",
      "PictureInPictureTrigger",
      "PlayPauseTrigger",
      "PlayingIndicator",
      "Portal",
      "Poster",
      "Range",
      "RateSelect",
      "RateSelectItem",
      "Root",
      "Seek",
      "SeekBuffer",
      "SelectArrow",
      "SelectContent",
      "SelectGroup",
      "SelectIcon",
      "SelectItemIndicator",
      "SelectItemText",
      "SelectLabel",
      "SelectPortal",
      "SelectScrollDownButton",
      "SelectScrollUpButton",
      "SelectSeparator",
      "SelectTrigger",
      "SelectValue",
      "SelectViewport",
      "Thumb",
      "Time",
      "Track",
      "Video",
      "VideoQualitySelect",
      "VideoQualitySelectItem",
      "Volume",
      "VolumeIndicator",
    ]
  `);
});
