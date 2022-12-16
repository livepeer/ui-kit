import { MediaControllerState } from 'livepeer/media';
import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';

export const useMediaController = <
  TElement extends HTMLMediaElement,
  TSlice = MediaControllerState<TElement>,
>(
  selector?: (s: MediaControllerState<TElement>) => TSlice,
) => {
  const useMediaControllerInternal = React.useContext(MediaControllerContext);

  return useMediaControllerInternal(
    selector as (s: MediaControllerState<HTMLMediaElement>) => TSlice,
  );
};
