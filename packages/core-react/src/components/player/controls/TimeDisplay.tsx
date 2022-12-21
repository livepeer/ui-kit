import { MediaControllerState } from '@livepeer/core';
import * as React from 'react';

import { getFormattedHoursMinutesSeconds } from './utils';

type TimeDisplayStateSlice = Pick<
  MediaControllerState,
  'duration' | 'progress' | 'live'
>;

type TimeDisplayCoreProps = TimeDisplayStateSlice;

export const useTimeDisplay = (props: TimeDisplayCoreProps) => {
  const { duration, progress, live } = props;

  const formattedTimeDisplay = React.useMemo(
    () => getFormattedHoursMinutesSeconds(progress ?? null),
    [progress],
  );

  const formattedDuration = React.useMemo(
    () => getFormattedHoursMinutesSeconds(duration ?? null),
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
