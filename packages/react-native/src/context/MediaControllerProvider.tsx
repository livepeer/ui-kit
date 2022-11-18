import { useClient } from '@livepeer/core-react/context';

import * as React from 'react';
import create from 'zustand';

import { createNativeControllerStore } from '../components/media/state/controls';

import { MediaElement } from '../components/media/types';

import { MediaControllerContext } from './MediaControllerContext';

export type MediaControllerProviderProps<TElement extends MediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
};

export const MediaControllerProvider = <TElement extends MediaElement>({
  element,
  children,
}: MediaControllerProviderProps<TElement>) => {
  const useMediaController = useMediaControllerStore(element);

  return (
    <MediaControllerContext.Provider value={useMediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <TElement extends MediaElement>(
  element: TElement | null,
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

  return store;
};
