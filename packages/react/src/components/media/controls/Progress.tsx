import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { PropsOf } from '../../system';
import { useMediaController } from '../context';
import { BaseSlider } from './BaseSlider';

export type ProgressProps = Omit<
  PropsOf<'input'>,
  'children' | 'onChange' | 'color'
> & {
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

const mediaControllerSelector = ({
  duration,
  progress,
  requestSeek,
  buffered,
}: MediaControllerState<HTMLMediaElement>) => ({
  duration,
  progress,
  requestSeek,
  buffered,
});

export const Progress = (props: ProgressProps) => {
  const { duration, progress, requestSeek, buffered } = useMediaController(
    mediaControllerSelector,
  );

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

  return (
    <BaseSlider
      ariaName={`progress of ${durationMinutes} minutes`}
      value={value}
      secondaryValue={secondaryValue}
      onChange={onChange}
    />
  );
};
