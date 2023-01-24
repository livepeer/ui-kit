import { MediaControllerState } from 'livepeer/media';
import * as React from 'react';
import { useStore } from 'zustand';

import { MediaControllerContext } from './MediaControllerContext';

export const useMediaController = <
  TSlice = MediaControllerState<HTMLMediaElement>,
>(
  selector: (s: MediaControllerState<HTMLMediaElement>) => TSlice,
) => {
  const mediaController = React.useContext(MediaControllerContext);

  return useStore(mediaController, selector);
};
