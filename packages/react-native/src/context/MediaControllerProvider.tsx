import { ControlsOptions, MediaPropsOptions } from '@livepeer/core-react';
import { useClient } from '@livepeer/core-react/context';

import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';
import { createNativeControllerStore } from '../components/media/state/controls';
import { MediaElement } from '../components/media/types';

export type MediaControllerProviderProps<TElement extends MediaElement> = {
  element: TElement | null;
  children: React.ReactNode;
  opts: ControlsOptions | undefined;
  mediaProps: MediaPropsOptions;
};

export const MediaControllerProvider = <TElement extends MediaElement>({
  element,
  children,
  opts,
  mediaProps,
}: MediaControllerProviderProps<TElement>) => {
  const mediaController = useMediaControllerStore(element, opts, mediaProps);

  return (
    <MediaControllerContext.Provider value={mediaController}>
      {children}
    </MediaControllerContext.Provider>
  );
};

const useMediaControllerStore = <TElement extends MediaElement>(
  element: TElement | null,
  opts: ControlsOptions | undefined,
  mediaProps: MediaPropsOptions,
) => {
  const client = useClient();

  const store = React.useMemo(
    () =>
      createNativeControllerStore<TElement>({
        storage: client.storage,
        opts: opts ?? {},
        mediaProps,
      }),
    [client?.storage, opts, mediaProps],
  );

  React.useEffect(() => {
    if (element) {
      store.setState({ _element: element });
    }
  }, [store, element]);

  return store;
};
