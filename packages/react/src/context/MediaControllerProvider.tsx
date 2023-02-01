import { useClient } from '@livepeer/core-react/context';
import { ControlsOptions, createControllerStore } from 'livepeer/media';
import { addEventListeners, getDeviceInfo } from 'livepeer/media/browser';
import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';
import { PlayerProps } from '../components';

export type MediaControllerProviderProps<TElement extends HTMLMediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  playerProps: PlayerProps;
  opts: ControlsOptions;
};

export const MediaControllerProvider = <TElement extends HTMLMediaElement>({
  element,
  children,
  playerProps,
  opts,
}: MediaControllerProviderProps<TElement>) => {
  const mediaController = useMediaControllerStore(element, opts, playerProps);

  return (
    <MediaControllerContext.Provider value={mediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <TElement extends HTMLMediaElement>(
  element: TElement | null,
  opts: ControlsOptions,
  playerProps: PlayerProps,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      createControllerStore<TElement>({
        element: element ?? null,
        device: getDeviceInfo(),
        storage: client.storage,
        opts: opts,
        playerProps: playerProps,
      }),

    [element, client?.storage, opts, playerProps],
  );

  React.useEffect(() => {
    const { destroy } = addEventListeners(store, opts);

    return () => {
      destroy?.();
    };
  }, [store, opts]);

  return store;
};
