import { MediaControllerState } from '@livepeer/core-react';
import * as React from 'react';

import { MediaControllerContext } from './MediaControllerContext';
import { MediaElement } from '../components/media/types';

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
