import { MediaControllerStore } from '@livepeer/core-react';
import * as React from 'react';

import { createNativeControllerStore } from '../components/media/state/controls';

import { MediaElement } from '../components/media/types';

export const MediaControllerContext = React.createContext<
  MediaControllerStore<MediaElement>
>(createNativeControllerStore<MediaElement>({ element: null }));
