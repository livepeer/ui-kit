import { DeviceInformation } from "@livepeer/core";

import { isHlsSupported } from "../../hls";
import { isAndroid, isIos, isMobile } from "../utils";
import { isFullscreenSupported } from "./fullscreen";
import { isPictureInPictureSupported } from "./pictureInPicture";
import { isWebRTCSupported } from "../../webrtc";

export const getDeviceInfo = (version: string): DeviceInformation => ({
  version,
  isAndroid: isAndroid(),
  isIos: isIos(),
  isMobile: isMobile(),
  userAgent:
    typeof navigator !== "undefined"
      ? navigator.userAgent
      : "Node.js or unknown",

  isFullscreenSupported: isFullscreenSupported(),
  isWebRTCSupported: isWebRTCSupported(),
  isPictureInPictureSupported: isPictureInPictureSupported(),
  isHlsSupported: isHlsSupported(),
  isVolumeChangeSupported: true,
});
