import * as React from 'react';
import Video from 'react-native-video';
import { UseBoundStore } from 'zustand';

import {
  MediaControllerStore,
  NativeMediaControllerState,
} from '../components/media';

import { MediaControllerContext } from './MediaControllerContext';

export const useMediaController = <
  TElement extends Video,
  TSlice = NativeMediaControllerState<TElement>,
>(
  selector?: (s: NativeMediaControllerState<TElement>) => TSlice,
) => {
  // typecast the context so that we can have video/audio-specific controller states
  const useMediaControllerInternal = React.useContext(
    MediaControllerContext,
  ) as UseBoundStore<MediaControllerStore<TElement>>;

  return useMediaControllerInternal(
    selector as (s: NativeMediaControllerState<TElement>) => TSlice,
  );
};
