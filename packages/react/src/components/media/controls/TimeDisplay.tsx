'use client'; // client component browser directive (React RFC-0227)

import { MediaControllerState } from 'livepeer/media/controls';
import { styling } from 'livepeer/styling';
import * as React from 'react';

import { PropsOf } from '../../system';
import { useMediaController } from '../context';

export type TimeDisplayProps = Omit<PropsOf<'span'>, 'children'>;

const mediaControllerSelector = ({
  duration,
  progress,
  live,
}: MediaControllerState<HTMLMediaElement>) => ({
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
    const minutes = Math.floor(valueInSeconds / 60);
    const seconds = Math.round(valueInSeconds % 60);

    return `${minutes.toFixed(0)}:${seconds.toFixed(0).padStart(2, '0')}`;
  }

  return `0:00`;
};

export const TimeDisplay = React.forwardRef<HTMLSpanElement, TimeDisplayProps>(
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
        <span
          className={styling.time.text()}
          aria-label={'Playback time'}
          ref={ref}
          {...props}
        >
          {formattedTime}
        </span>
        {live && (
          <div className={styling.time.container()}>
            <div className={styling.time.liveIndicator()} />
            <span
              className={styling.time.text()}
              aria-label={'Live streaming media'}
              ref={ref}
              {...props}
            >
              LIVE
            </span>
          </div>
        )}
      </>
    );
  },
);
