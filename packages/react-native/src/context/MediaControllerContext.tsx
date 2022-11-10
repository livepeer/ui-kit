import * as React from 'react';
import Video from 'react-native-video';
import create, { UseBoundStore } from 'zustand';

import {
  MediaControllerStore,
  createControllerStore,
} from '../components/media';

export const MediaControllerContext = React.createContext<
  UseBoundStore<MediaControllerStore<Video>>
>(create(createControllerStore(null)));
