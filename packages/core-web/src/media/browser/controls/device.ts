import { DeviceInformation } from '@livepeer/core';

import { isAndroid, isIos, isMobile } from '../utils';

export const getDeviceInfo = (version: string): DeviceInformation => ({
  version,
  isAndroid: isAndroid(),
  isIos: isIos(),
  isMobile: isMobile(),
  userAgent:
    typeof navigator !== 'undefined'
      ? navigator.userAgent
      : 'Node.js or unknown',
});
