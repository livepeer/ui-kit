import { MediaControllerState } from '@livepeer/core-react';
import { useTimeDisplay } from '@livepeer/core-react/components';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { TimeContainer, TimeLiveIndicator, TimeText } from '../../styling';

import { MediaElement } from '../types';

const mediaControllerSelector = ({
  duration,
  progress,
  live,
}: MediaControllerState<MediaElement>) => ({
  duration,
  progress,
  live,
});

export const TimeDisplay: React.FC = () => {
  const { duration, progress, live } = useMediaController(
    mediaControllerSelector,
  );

  const { title, live: isLive } = useTimeDisplay({
    duration,
    progress,
    live,
  });

  return (
    <>
      {!isLive ? (
        <TimeText
          size={{
            '@md': 'medium',
            '@lg': 'large',
          }}
        >
          {title}
        </TimeText>
      ) : (
        <TimeContainer accessibilityLabel="Live streaming media">
          <TimeLiveIndicator />
          <TimeText
            size={{
              '@md': 'medium',
              '@lg': 'large',
            }}
          >
            LIVE
          </TimeText>
        </TimeContainer>
      )}
    </>
  );
};
