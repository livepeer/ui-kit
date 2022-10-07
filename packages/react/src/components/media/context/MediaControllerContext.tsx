import {
  MediaControllerStore,
  createControllerStore,
} from 'livepeer/media/controls';

import * as React from 'react';
import create, { UseBoundStore } from 'zustand';

export const MediaControllerContext = React.createContext<
  UseBoundStore<MediaControllerStore<HTMLMediaElement>>
>(create(createControllerStore(null)));
