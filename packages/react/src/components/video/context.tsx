import { MediaControllerState, registerEventListeners } from 'livepeer';
import * as React from 'react';
import create from 'zustand';

export const VideoControllerContext =
  React.createContext<MediaControllerState | null>(null);

export const useControllerStore = (element: HTMLVideoElement | null) => {
  const useStore = React.useMemo(
    () => create(registerEventListeners(element)),
    [element],
  );

  return useStore();
};
