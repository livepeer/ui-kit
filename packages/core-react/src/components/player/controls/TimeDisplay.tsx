import { MediaControllerState } from 'livepeer';
import * as React from 'react';

type TimeDisplayStateSlice = Pick<
  MediaControllerState,
  'duration' | 'progress' | 'live'
>;

type TimeDisplayCoreProps = TimeDisplayStateSlice;

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

export const useTimeDisplay = (props: TimeDisplayCoreProps) => {
  const { duration, progress, live } = props;

  const formattedTimeDisplay = React.useMemo(
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
        ? formattedTimeDisplay
        : `${formattedTimeDisplay} / ${formattedDuration}`,
    [formattedTimeDisplay, formattedDuration, live],
  );

  return {
    title: formattedTime,
    live,
  };
};
