import { DeviceInformation } from "@livepeer/core";

import { isHlsSupported } from "../../hls";
import { isWebRTCSupported } from "../../webrtc";
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
  isWebRTCSupported: isWebRTCSupported(),
  isPictureInPictureSupported: isPictureInPictureSupported(),
  isHlsSupported: isHlsSupported(),
  isVolumeChangeSupported: true,
});
