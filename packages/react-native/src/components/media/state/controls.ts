import {
  MediaControllerState,
  Storage,
  createControllerStore,
} from '@livepeer/core-react';
import { Platform } from 'react-native';
import { StoreApi } from 'zustand';

import { MediaElement } from '../types';

export const createNativeControllerStore = <TElement extends MediaElement>({
  element,
  storage,
}: {
  element: TElement | null;
  storage?: Storage;
}): StoreApi<MediaControllerState<MediaElement>> => {
  return createControllerStore<TElement>({
    element,
    device: {
      isMobile: true,
      isAndroid: Platform?.OS === 'android',
      isIos: Platform?.OS === 'ios',
    },
    storage,
  });
};
