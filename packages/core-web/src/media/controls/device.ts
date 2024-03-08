import type { DeviceInformation } from "@livepeer/core/media";

import { isHlsSupported } from "../../hls/hls";
import { getRTCPeerConnectionConstructor } from "../../webrtc/shared";
import { isAndroid, isIos, isMobile } from "../utils";
import { isFullscreenSupported } from "./fullscreen";
import { isPictureInPictureSupported } from "./pictureInPicture";

export const getDeviceInfo = (version: string): DeviceInformation => ({
  version,
  isAndroid: isAndroid(),
  isIos: isIos(),
  isMobile: isMobile(),
  userAgent:
    typeof navigator !== "undefined"
      ? navigator.userAgent
      : "Node.js or unknown",
  screenWidth:
    typeof window !== "undefined" && window?.screen
      ? window?.screen?.width ?? null
      : null,

  isFullscreenSupported: isFullscreenSupported(),
  isWebRTCSupported: Boolean(getRTCPeerConnectionConstructor()),
  isPictureInPictureSupported: isPictureInPictureSupported(),
  isHlsSupported: isHlsSupported(),
  isVolumeChangeSupported: true,
});
