import { expect, it } from "vitest";

import * as Exports from "./webrtc";

it("should expose correct exports", () => {
  expect(Object.keys(Exports).sort()).toMatchInlineSnapshot(`
    [
      "changeMediaStream",
      "createNewWHEP",
      "createNewWHIP",
      "getDisplayMedia",
      "getMediaDevices",
      "getUserMedia",
      "isWebRTCSupported",
    ]
  `);
});
