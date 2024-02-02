import { expect, it } from "vitest";

import * as Exports from "./broadcast";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "AudioEnabledIndicator",
      "AudioEnabledTrigger",
      "Container",
      "Controls",
      "EnabledIndicator",
      "EnabledTrigger",
      "ErrorIndicator",
      "FullscreenIndicator",
      "FullscreenTrigger",
      "LiveIndicator",
      "LoadingIndicator",
      "PictureInPictureTrigger",
      "Portal",
      "Range",
      "Root",
      "ScreenshareIndicator",
      "ScreenshareTrigger",
      "SelectArrow",
      "SelectContent",
      "SelectGroup",
      "SelectIcon",
      "SelectItem",
      "SelectItemIndicator",
      "SelectItemText",
      "SelectLabel",
      "SelectPortal",
      "SelectRoot",
      "SelectScrollDownButton",
      "SelectScrollUpButton",
      "SelectSeparator",
      "SelectTrigger",
      "SelectValue",
      "SelectViewport",
      "SourceSelect",
      "Thumb",
      "Time",
      "Track",
      "Video",
      "VideoEnabledIndicator",
      "VideoEnabledTrigger",
    ]
  `);
});
