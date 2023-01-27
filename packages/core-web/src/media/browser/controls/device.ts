import { DeviceInformation } from '@livepeer/core';

import { isAndroid, isIos, isMobile } from '../utils';

export const getDeviceInfo = (): DeviceInformation => ({
  isAndroid: isAndroid(),
  isIos: isIos(),
  isMobile: isMobile(),
  userAgent:
    typeof navigator !== 'undefined'
      ? navigator.userAgent
      : 'Node.js or unknown',
});
