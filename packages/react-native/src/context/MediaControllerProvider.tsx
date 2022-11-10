import { useClient } from '@livepeer/core-react/context';

import * as React from 'react';
import Video from 'react-native-video';
import create from 'zustand';

import {
  ControlsOptions,
  addEventListeners,
  createControllerStore,
} from '../components/media';

import { MediaControllerContext } from './MediaControllerContext';

export type MediaControllerProviderProps<TElement extends Video> = {
  element: TElement | null;
  children: React.ReactNode;
  options?: ControlsOptions;
};

export const MediaControllerProvider = <TElement extends Video>({
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

const useMediaControllerStore = <TElement extends Video>(
  element: TElement | null,
  options?: ControlsOptions,
) => {
  const client = useClient();

  const useStore = React.useMemo(
    () => create(createControllerStore<TElement>(element, client.storage)),
    [element, client?.storage],
  );

  React.useEffect(() => {
    const { destroy } = addEventListeners(useStore, options);

    return () => {
      destroy?.();
    };
  }, [useStore, options]);

  return useStore;
};
