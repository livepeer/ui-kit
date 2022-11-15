import { createControllerStore } from 'livepeer';
import { ClientStorage } from 'livepeer/src/storage';
import { Platform } from 'react-native';

import { MediaElement } from '../types';

export const createNativeControllerStore = <TElement extends MediaElement>({
  element,
  storage,
}: {
  element: TElement | null;
  storage?: ClientStorage;
}) => {
  return createControllerStore({
    element,
    device: {
      isMobile: true,
      isAndroid: Platform?.OS === 'android',
      isIos: Platform?.OS === 'ios',
    },
    storage,
  });
};
