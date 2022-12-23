// polyfill for URL
import 'react-native-url-polyfill/auto';

import { addMediaMetricsToStore } from '@livepeer/core-react';
import { HlsPlayerProps as CoreHlsPlayerProps } from '@livepeer/core-react/components';
import { Video } from 'expo-av';

import * as React from 'react';

import { MediaControllerContext } from '../../../context';
import { PosterSource } from '../Player';
import { MediaElement } from '../types';
import { VideoCustomizationProps, VideoPlayer } from './VideoPlayer';

export type HlsPlayerProps = CoreHlsPlayerProps<MediaElement, PosterSource> &
  VideoCustomizationProps;

export const HlsPlayer = React.forwardRef<Video, HlsPlayerProps>(
  (props, ref) => {
    const { src, onMetricsError } = props;

    const store = React.useContext(MediaControllerContext);

    React.useEffect(() => {
      const { destroy } = addMediaMetricsToStore(store, src?.src, (e) => {
        onMetricsError?.(e as Error);
        console.error('Not able to report player metrics', e);
      });

      return destroy;
    }, [onMetricsError, store, src]);

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
