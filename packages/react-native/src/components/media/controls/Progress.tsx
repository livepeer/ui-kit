import { useProgress } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { PropsOf } from '../../system';
import { MediaElement } from '../types';
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
}: MediaControllerState<MediaElement>) => ({
  duration,
  progress,
  requestSeek,
  buffered,
});

export const Progress = (props: ProgressProps) => {
  const { duration, progress, requestSeek, buffered } = useMediaController(
    mediaControllerSelector,
  );

  const { progressProps, title } = useProgress({
    duration,
    progress,
    requestSeek,
    buffered,
    ...props,
  });

  return <BaseSlider {...progressProps} ariaName={title} />;
};
