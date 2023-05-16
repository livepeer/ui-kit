import { ControlsOptions } from '@livepeer/core-react';
import { useClient } from '@livepeer/core-react/context';

import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';
import { PlayerProps } from '../components';
import { createNativeControllerStore } from '../components/media/state/controls';

import { MediaElement } from '../components/media/types';

export type MediaControllerProviderProps<TElement extends MediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  opts: ControlsOptions | undefined;
  playerProps: PlayerProps<object>;
};

export const MediaControllerProvider = <TElement extends MediaElement>({
  element,
  children,
  opts,
  playerProps,
}: MediaControllerProviderProps<TElement>) => {
  const mediaController = useMediaControllerStore(element, opts, playerProps);

  return (
    <MediaControllerContext.Provider value={mediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <TElement extends MediaElement>(
  element: TElement | null,
  opts: ControlsOptions | undefined,
  playerProps: PlayerProps<object>,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      createNativeControllerStore<TElement>({
        storage: client.storage,
        opts: opts ?? {},
        playerProps,
      }),
    [client?.storage, opts, playerProps],
  );

  React.useEffect(() => {
    if (element) {
      store.setState({ _element: element });
    }
  }, [store, element]);

  return store;
};
