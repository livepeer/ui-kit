import { useTimeDisplay } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';

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
      <TimeText>{title}</TimeText>
      {isLive && (
        <TimeContainer accessibilityLabel="Live streaming media">
          <TimeLiveIndicator />
          <TimeText>LIVE</TimeText>
        </TimeContainer>
      )}
    </>
  );
};
