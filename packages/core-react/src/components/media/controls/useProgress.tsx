import { MediaControllerState } from '@livepeer/core';

import * as React from 'react';

type ProgressStateSlice = Pick<
  MediaControllerState,
  'duration' | 'progress' | 'requestSeek' | 'buffered' | 'live'
>;

export type ProgressProps = {
  /**
   * The icon to be used for the progress thumb.
   * @type React.ReactElement
   */
  thumbIcon?: React.ReactElement;

  /**
   * The color of the range background.
   * @type string
   */
  rangeBackgroundColor?: string;

  /**
   * The callback when the user seeks with the progress component.
   */
  onSeek?: (progress: number) => void;
};

type ProgressCoreProps = ProgressStateSlice & ProgressProps;

export const useProgress = (props: ProgressCoreProps) => {
  const { duration, progress, requestSeek, buffered, live, ...rest } = props;

  const [min, max, current] = React.useMemo(
    () =>
      [
        0,
        duration && !isNaN(duration) ? duration : 0,
        progress && !isNaN(progress) ? progress : 0,
      ] as const,
    [duration, progress],
  );
  const value = React.useMemo(() => current / (max - min), [min, max, current]);
  const secondaryValue = React.useMemo(
    () => buffered / (max - min),
    [min, max, buffered],
  );

  const onChange = React.useCallback(
    async (value: number) => {
      const newSeek = value * (max - min);

      await props?.onSeek?.(newSeek);
      requestSeek(newSeek);
    },
    [max, min, requestSeek, props],
  );

  const durationMinutes = React.useMemo(
    () => (duration / 60).toFixed(1),
    [duration],
  );

  return {
    isVisible: !live,
    title: `progress of ${durationMinutes} minutes`,
    progressProps: {
      onChange,
      value,
      secondaryValue,
      leftCss: { backgroundColor: '$progressLeft' },
      middleCss: { backgroundColor: '$progressMiddle' },
      rightCss: { backgroundColor: '$progressRight' },
      thumbCss: { backgroundColor: '$progressThumb' },
      ...rest,
    },
  };
};
