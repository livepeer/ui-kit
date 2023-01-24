import { useClient } from '@livepeer/core-react/context';
import { ControlsOptions, createControllerStore } from 'livepeer/media';
import { addEventListeners, getDeviceInfo } from 'livepeer/media/browser';
import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';

export type MediaControllerProviderProps<TElement extends HTMLMediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  opts: ControlsOptions;
};

export const MediaControllerProvider = <TElement extends HTMLMediaElement>({
  element,
  children,
  opts,
}: MediaControllerProviderProps<TElement>) => {
  const mediaController = useMediaControllerStore(element, opts);

  return (
    <MediaControllerContext.Provider value={mediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <TElement extends HTMLMediaElement>(
  element: TElement | null,
  opts?: ControlsOptions,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      createControllerStore<TElement>({
        element: element ?? null,
        device: getDeviceInfo(),
        storage: client.storage,
        opts: opts ?? {},
      }),

    [element, client?.storage, opts],
  );

  React.useEffect(() => {
    const { destroy } = addEventListeners(store, opts);

    return () => {
      destroy?.();
    };
  }, [store, opts]);

  return store;
};
