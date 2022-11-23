import { useTimeDisplay } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';

import { useMediaController } from '../../../context';
import { TimeContainer, TimeLiveIndicator, TimeText } from '../../styling';
import { PropsOf } from '../../system';
import { MediaElement } from '../types';

export type TimeDisplayProps = Omit<PropsOf<typeof TimeText>, 'children'>;

const mediaControllerSelector = ({
  duration,
  progress,
  live,
}: MediaControllerState<MediaElement>) => ({
  duration,
  progress,
  live,
});

export const TimeDisplay = (props: TimeDisplayProps) => {
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
      <TimeText {...props}>{title}</TimeText>
      {isLive && (
        <TimeContainer accessibilityLabel="Live streaming media">
          <TimeLiveIndicator />
          <TimeText {...props}>LIVE</TimeText>
        </TimeContainer>
      )}
    </>
  );
};
