import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';
import { Slider } from './Slider';

import { PropsOf } from './system';

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
  onPlay,
  onPause,
  playing,
  buffered,
}: MediaControllerState<HTMLMediaElement>) => ({
  duration,
  progress,
  requestSeek,
  onPlay,
  onPause,
  playing,
  buffered,
});

export const Progress = (props: ProgressProps) => {
  const {
    duration,
    progress,
    requestSeek,
    onPlay,
    onPause,
    playing,
    buffered,
  } = useMediaController(mediaControllerSelector);

  const [isDragging, setIsDragging] = React.useState<
    'playing' | 'paused' | 'none'
  >('none');

  const [min, max] = React.useMemo(
    () => [0, duration, progress] as const,
    [duration, progress],
  );
  const value = React.useMemo(
    () => progress / (max - min),
    [min, max, progress],
  );
  const secondaryValue = React.useMemo(
    () => buffered / (max - min),
    [min, max, buffered],
  );

  const onChange = React.useCallback(
    async (value: number) => {
      if (isDragging === 'none') {
        setIsDragging(playing ? 'playing' : 'paused');

        onPause();
      }

      const newSeek = value * (max - min);

      await props?.onSeek?.(newSeek);
      requestSeek(newSeek);
    },
    [max, min, requestSeek, isDragging, props, playing, onPause],
  );

  const onDone = React.useCallback(async () => {
    if (isDragging === 'playing') {
      onPlay();
    }
    setIsDragging('none');
  }, [isDragging, onPlay]);

  return (
    <Slider
      value={value}
      secondaryValue={secondaryValue}
      onChange={onChange}
      onDone={onDone}
    />
  );
};
