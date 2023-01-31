import { createStorage } from 'livepeer';
import { MediaControllerStore, createControllerStore } from 'livepeer/media';
import { getDeviceInfo } from 'livepeer/media/browser';
import * as React from 'react';

export const MediaControllerContext = React.createContext<
  MediaControllerStore<HTMLMediaElement>
>(
  createControllerStore<HTMLMediaElement>({
    element: null,
    device: getDeviceInfo(),
    storage: createStorage({}),
    playerProps: {},
    opts: {},
  }),
);
