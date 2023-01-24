import { MediaControllerState } from '@livepeer/core-react';
import * as React from 'react';

import { useStore } from 'zustand';

import { MediaControllerContext } from './MediaControllerContext';
import { MediaElement } from '../components/media/types';

export const useMediaController = <
  TSlice = MediaControllerState<MediaElement>,
>(
  selector: (s: MediaControllerState<MediaElement>) => TSlice,
) => {
  const mediaController = React.useContext(MediaControllerContext);

  return useStore(mediaController, selector);
};
