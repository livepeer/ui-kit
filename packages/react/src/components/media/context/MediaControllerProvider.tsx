import {
  ControlsOptions,
  addEventListeners,
  createControllerStore,
} from 'livepeer/media/controls';
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
  const useStore = React.useMemo(
    () => create(createControllerStore<TElement>(element)),
    [element],
  );

  React.useEffect(() => {
    const { destroy } = addEventListeners(useStore, options);

    return () => {
      destroy?.();
    };
  }, [useStore, options]);

  return useStore;
};
