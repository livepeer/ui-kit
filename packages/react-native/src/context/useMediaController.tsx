import { MediaControllerState } from '@livepeer/core-react';
import * as React from 'react';

import { MediaElement } from '../components/media/types';
import { MediaControllerContext } from './MediaControllerContext';

export const useMediaController = <
  TElement extends MediaElement,
  TSlice = MediaControllerState<TElement>,
>(
  selector?: (s: MediaControllerState<TElement>) => TSlice,
) => {
  const useMediaControllerInternal = React.useContext(MediaControllerContext);

  return useMediaControllerInternal(
    selector as (s: MediaControllerState<MediaElement>) => TSlice,
  );
};
