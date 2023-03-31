import { useClient } from '@livepeer/core-react/context';
import { ControlsOptions, createControllerStore } from 'livepeer/media';
import { addEventListeners, getDeviceInfo } from 'livepeer/media/browser';
import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';
import { PlayerProps } from '../components';

export type MediaControllerProviderProps<
  TElement extends HTMLMediaElement,
  TPlaybackPolicyObject extends object,
> = {
  element: TElement | null;
  children: React.ReactNode;
  playerProps: PlayerProps<TPlaybackPolicyObject>;
  opts: ControlsOptions;
};

export const MediaControllerProvider = <
  TElement extends HTMLMediaElement,
  TPlaybackPolicyObject extends object,
>({
  element,
  children,
  playerProps,
  opts,
}: MediaControllerProviderProps<TElement, TPlaybackPolicyObject>) => {
  const mediaController = useMediaControllerStore(element, opts, playerProps);

  return (
    <MediaControllerContext.Provider value={mediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <
  TElement extends HTMLMediaElement,
  TPlaybackPolicyObject extends object,
>(
  element: TElement | null,
  opts: ControlsOptions,
  playerProps: PlayerProps<TPlaybackPolicyObject>,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      createControllerStore<TElement>({
        element: element ?? null,
        device: getDeviceInfo(),
        storage: client.storage,
        opts: opts,
        playerProps: {
          ...playerProps,
          src: null,
          preload:
            element?.preload === 'auto'
              ? 'full'
              : element?.preload === 'metadata'
              ? 'metadata'
              : 'none',
        },
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
