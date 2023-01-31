import { HlsPlayerProps as CoreHlsPlayerProps } from '@livepeer/core-react/components';
import { Video } from 'expo-av';

import * as React from 'react';

import { VideoCustomizationProps, VideoPlayer } from './VideoPlayer';
import { PosterSource } from '../Player';
import { MediaElement } from '../types';

export type HlsPlayerProps = CoreHlsPlayerProps<MediaElement, PosterSource> &
  VideoCustomizationProps;

export const HlsPlayer = React.forwardRef<Video, HlsPlayerProps>(
  (props, ref) => {
    const { src } = props;

    return (
      <VideoPlayer
        {...props}
        ref={ref}
        src={[
          {
            ...src,
            type: 'video',
          },
        ]}
      />
    );
  },
);

HlsPlayer.displayName = 'HlsPlayer';
