import { createStorage, version } from '@livepeer/core-web';
import {
  MediaControllerStore,
  createControllerStore,
} from '@livepeer/core-web/media';
import { getDeviceInfo } from '@livepeer/core-web/media/browser';
import * as React from 'react';

export const MediaControllerContext = React.createContext<
  MediaControllerStore<HTMLMediaElement, MediaStream>
>(
  createControllerStore<HTMLMediaElement, MediaStream>({
    element: undefined,
    device: getDeviceInfo(version.react),
    storage: createStorage({}),
    mediaProps: {},
    opts: {},
  }),
);
