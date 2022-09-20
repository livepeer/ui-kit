import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { PropsOf } from '../../system';
import { useMediaController } from '../context';

export type TimeDisplayProps = Omit<PropsOf<'span'>, 'children'>;

const mediaControllerSelector = ({
  duration,
  progress,
}: MediaControllerState<HTMLMediaElement>) => ({
  duration,
  progress,
});

const getFormattedMinutesAndSeconds = (valueInSeconds: number | null) => {
  if (valueInSeconds !== null && !isNaN(valueInSeconds)) {
    const minutes = Math.floor(valueInSeconds / 60);
    const seconds = Math.round(valueInSeconds % 60);

    return `${minutes.toFixed(0)}:${seconds.toFixed(0).padStart(2, '0')}`;
  }

  return `0:00`;
};

export const TimeDisplay = React.forwardRef<HTMLSpanElement, TimeDisplayProps>(
  (props, ref) => {
    const { duration, progress } = useMediaController(mediaControllerSelector);

    const formattedProgress = React.useMemo(
      () => getFormattedMinutesAndSeconds(progress ?? 0),
      [progress],
    );

    const formattedDuration = React.useMemo(
      () => getFormattedMinutesAndSeconds(duration ?? null),
      [duration],
    );

    return (
      <span
        className={styling.time()}
        aria-label={'Playback time'}
        ref={ref}
        {...props}
      >
        {`${formattedProgress} / ${formattedDuration}`}
      </span>
    );
  },
);
