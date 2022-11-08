import {
  MediaControllerState,
  MediaControllerStore,
} from 'livepeer/media/controls';

import * as React from 'react';
import { UseBoundStore } from 'zustand';

import { MediaControllerContext } from './MediaControllerContext';

export const useMediaController = <
  TElement extends HTMLMediaElement,
  TSlice = MediaControllerState<TElement>,
>(
  selector?: (s: MediaControllerState<TElement>) => TSlice,
) => {
  // typecast the context so that we can have video/audio-specific controller states
  const useMediaControllerInternal = React.useContext(
    MediaControllerContext,
  ) as UseBoundStore<MediaControllerStore<TElement>>;

  return useMediaControllerInternal(
    selector as (s: MediaControllerState<TElement>) => TSlice,
  );
};
