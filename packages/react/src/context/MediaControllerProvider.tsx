import { useClient } from '@livepeer/core-react/context';
import {
  ControlsOptions,
  PlayerPropsOptions,
  createControllerStore,
} from 'livepeer/media';
import { addEventListeners, getDeviceInfo } from 'livepeer/media/browser';
import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';

export type MediaControllerProviderProps<TElement extends HTMLMediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  playerProps: PlayerPropsOptions;
  opts: ControlsOptions | undefined;
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
  opts: ControlsOptions | undefined,
  playerProps: PlayerPropsOptions,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      createControllerStore<TElement>({
        device: getDeviceInfo(),
        storage: client.storage,
        opts: opts ?? {},
        playerProps,
      }),
    [client?.storage, opts, playerProps],
  );

  React.useEffect(() => {
    const { destroy } = addEventListeners(store, opts);

    return () => {
      destroy?.();
    };
  }, [store, opts]);

  React.useEffect(() => {
    if (element) {
      console.log('setting new element');
      store.setState({ _element: element });
    }
  }, [store, element]);

  return store;
};
