import {
  ControlsOptions,
  MediaControllerState,
  Storage,
  createControllerStore,
  createStorage,
  version,
} from '@livepeer/core-react';
import { Platform } from 'react-native';
import { StoreApi } from 'zustand';

import { PlayerProps } from '../Player';

import { MediaElement } from '../types';

export const createNativeControllerStore = <TElement extends MediaElement>({
  storage,
  opts,
  playerProps,
}: {
  storage?: Storage;
  opts?: ControlsOptions;
  playerProps?: PlayerProps<object>;
}): StoreApi<MediaControllerState<MediaElement>> => {
  return createControllerStore<TElement>({
    element: undefined,
    device: {
      version: version.reactNative,
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
      playbackId: playerProps?.playbackId ?? undefined,
    },
  });
};
