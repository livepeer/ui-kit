import { MediaControllerStore } from 'livepeer';
import * as React from 'react';
import create, { UseBoundStore } from 'zustand';

import { createNativeControllerStore } from '../components/media/state/controls';

import { MediaElement } from '../components/media/types';

export const MediaControllerContext = React.createContext<
  UseBoundStore<MediaControllerStore<MediaElement>>
>(create(createNativeControllerStore<MediaElement>({ element: null })));
