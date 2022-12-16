import {
  ControlsOptions,
  MediaControllerState,
  Storage,
  createControllerStore,
  createStorage,
} from '@livepeer/core-react';
import { Platform } from 'react-native';
import { StoreApi } from 'zustand';

import { MediaElement } from '../types';

export const createNativeControllerStore = <TElement extends MediaElement>({
  element,
  storage,
  opts,
}: {
  element: TElement | null;
  storage?: Storage;
  opts?: ControlsOptions;
}): StoreApi<MediaControllerState<MediaElement>> => {
  return createControllerStore<TElement>({
    element,
    device: {
      isMobile: true,
      isAndroid: Platform?.OS === 'android',
      isIos: Platform?.OS === 'ios',
    },
    storage: storage ?? createStorage({}),
    opts: opts ?? {},
  });
};
