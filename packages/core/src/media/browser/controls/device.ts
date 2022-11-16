import { DeviceInformation } from '../../core';
import { isAndroid, isIos, isMobile } from '../utils';

export const getDeviceInfo = (): DeviceInformation => ({
  isAndroid: isAndroid(),
  isIos: isIos(),
  isMobile: isMobile(),
});
