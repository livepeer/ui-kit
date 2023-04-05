import {
  ControlsOptions,
  MediaControllerState,
  Storage,
  createControllerStore,
  createStorage,
} from '@livepeer/core-react';
import { Platform } from 'react-native';
import { StoreApi } from 'zustand';

import { PlayerProps } from '../Player';

import { MediaElement } from '../types';

export const createNativeControllerStore = <TElement extends MediaElement>({
  element,
  storage,
  opts,
  playerProps,
}: {
  element: TElement | null;
  storage?: Storage;
  opts?: ControlsOptions;
  playerProps?: PlayerProps<object>;
}): StoreApi<MediaControllerState<MediaElement>> => {
  return createControllerStore<TElement>({
    element,
    device: {
      isMobile: true,
      isAndroid: Platform?.OS === 'android',
      isIos: Platform?.OS === 'ios',
      userAgent: `${Platform?.OS}${Platform.isTV ? 'TV' : ''}: ${
        Platform.Version
      }`,
    },
    storage: storage ?? createStorage({}),
    opts: opts ?? {},
    playerProps: {
      ...playerProps,
      preload: 'none',
      src: null,
    },
  });
};
