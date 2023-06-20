import {
  ControlsOptions,
  MediaControllerState,
  MediaPropsOptions,
  Storage,
  createControllerStore,
  createStorage,
  version,
} from '@livepeer/core-react';
import { Platform } from 'react-native';
import { StoreApi } from 'zustand';

import { MediaElement } from '../types';

export const createNativeControllerStore = <TElement extends MediaElement>({
  storage,
  opts,
  mediaProps,
}: {
  storage?: Storage;
  opts?: ControlsOptions;
  mediaProps?: MediaPropsOptions;
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
    mediaProps: {
      ...mediaProps,
      playbackId: mediaProps?.playbackId ?? undefined,
    },
  });
};
