import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { PropsOf } from '../../system';

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
    const roundedValue = Math.round(valueInSeconds);

    const minutes = Math.floor(roundedValue / 60);
    const seconds = Math.floor(roundedValue % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
