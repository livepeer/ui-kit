import { useClient } from '@livepeer/core-react/context';
import { ControlsOptions } from 'livepeer';
import * as React from 'react';
import create from 'zustand';

import { createNativeControllerStore } from '../components/media';
import { MediaElement } from '../components/media/types';

import { MediaControllerContext } from './MediaControllerContext';

export type MediaControllerProviderProps<TElement extends MediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  options?: ControlsOptions;
};

export const MediaControllerProvider = <TElement extends MediaElement>({
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

const useMediaControllerStore = <TElement extends MediaElement>(
  element: TElement | null,
  _options?: ControlsOptions,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      create(
        createNativeControllerStore<TElement>({
          element,
          storage: client.storage,
        }),
      ),
    [element, client?.storage],
  );

  // React.useEffect(() => {
  //   const { destroy } = addEventListeners(store, options);

  //   return () => {
  //     destroy?.();
  //   };
  // }, [store, options]);

  return store;
};
