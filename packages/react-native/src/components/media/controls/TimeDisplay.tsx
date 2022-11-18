import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { TimeContainer, TimeLiveIndicator, TimeText } from '../../styling';
import { PropsOf } from '../../system';
import { MediaElement } from '../types';

export type TimeDisplayProps = Omit<PropsOf<'span'>, 'children'>;

const mediaControllerSelector = ({
  duration,
  progress,
  live,
}: MediaControllerState<MediaElement>) => ({
  duration,
  progress,
  live,
});

const getFormattedMinutesAndSeconds = (valueInSeconds: number | null) => {
  if (
    valueInSeconds !== null &&
    !isNaN(valueInSeconds) &&
    isFinite(valueInSeconds)
  ) {
    const roundedValue = Math.round(valueInSeconds);

    const minutes = Math.floor(roundedValue / 60);
    const seconds = Math.floor(roundedValue % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return `0:00`;
};

export const TimeDisplay = React.forwardRef<typeof TimeText, TimeDisplayProps>(
  (props, ref) => {
    const { duration, progress, live } = useMediaController(
      mediaControllerSelector,
    );

    const formattedProgress = React.useMemo(
      () => getFormattedMinutesAndSeconds(progress ?? 0),
      [progress],
    );

    const formattedDuration = React.useMemo(
      () => getFormattedMinutesAndSeconds(duration ?? null),
      [duration],
    );

    const formattedTime = React.useMemo(
      () =>
        live
          ? formattedProgress
          : `${formattedProgress} / ${formattedDuration}`,
      [formattedProgress, formattedDuration, live],
    );

    return (
      <>
        <TimeText
          // aria-label={'Playback time'}
          ref={ref}
          {...props}
        >
          {formattedTime}
        </TimeText>
        {live && (
          <TimeContainer>
            <TimeLiveIndicator />
            <TimeText
              // aria-label={'Live streaming media'}
              ref={ref}
              {...props}
            >
              LIVE
            </TimeText>
          </TimeContainer>
        )}
      </>
    );
  },
);
