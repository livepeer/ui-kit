import { Video } from 'expo-av';
import { HlsSrc } from 'livepeer';
import { addMediaMetricsToStore } from 'livepeer/media';

import * as React from 'react';

import { MediaControllerContext } from '../../../context';
import { PlayerObjectFit } from '../Player';
import { VideoPlayer } from './VideoPlayer';

export type HlsPlayerProps = {
  src: HlsSrc;
  objectFit: PlayerObjectFit;
  controls?: boolean;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  poster?: string;
  jwt?: string;
  onMetricsError?: (error: Error) => void;
};

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
