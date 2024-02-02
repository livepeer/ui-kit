import { expect, it } from "vitest";

import * as Exports from "./assets";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "ClipIcon",
      "DisableAudioIcon",
      "DisableVideoIcon",
      "EnableAudioIcon",
      "EnableVideoIcon",
      "EnterFullscreenIcon",
      "ExitFullscreenIcon",
      "LoadingIcon",
      "MuteIcon",
      "OfflineErrorIcon",
      "PauseIcon",
      "PictureInPictureIcon",
      "PlayIcon",
      "PrivateErrorIcon",
      "SettingsIcon",
      "StartScreenshareIcon",
      "StopIcon",
      "StopScreenshareIcon",
      "UnmuteIcon",
    ]
  `);
});
