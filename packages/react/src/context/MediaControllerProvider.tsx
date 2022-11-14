import { useClient } from '@livepeer/core-react/context';
import {
  ControlsOptions,
  addEventListeners,
  getDeviceInfo,
} from 'livepeer/media/browser';
import { createControllerStore } from 'livepeer/media/core';
import * as React from 'react';
import create from 'zustand';

import { MediaControllerContext } from './MediaControllerContext';

export type MediaControllerProviderProps<TElement extends HTMLMediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  options?: ControlsOptions;
};

export const MediaControllerProvider = <TElement extends HTMLMediaElement>({
  element,
  children,
  options,
}: MediaControllerProviderProps<TElement>) => {
  const useMediaController = useMediaControllerStore(element, options);

  return (
    <MediaControllerContext.Provider value={useMediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <TElement extends HTMLMediaElement>(
  element: TElement | null,
  options?: ControlsOptions,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      create(
        createControllerStore<TElement>({
          element: element ?? null,
          device: getDeviceInfo(),
          storage: client.storage,
        }),
      ),
    [element, client?.storage],
  );

  React.useEffect(() => {
    const { destroy } = addEventListeners(store, options);

    return () => {
      destroy?.();
    };
  }, [store, options]);

  return store;
};
