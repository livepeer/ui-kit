import { createStorage } from 'livepeer';
import { MediaControllerStore, createControllerStore } from 'livepeer/media';
import { getDeviceInfo } from 'livepeer/media/browser';
import * as React from 'react';
import create, { UseBoundStore } from 'zustand';

export const MediaControllerContext = React.createContext<
  UseBoundStore<MediaControllerStore<HTMLMediaElement>>
>(
  create(
    createControllerStore<HTMLMediaElement>({
      element: null,
      device: getDeviceInfo(),
      storage: createStorage({}),
      opts: {},
    }),
  ),
);
