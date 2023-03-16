import { MediaControllerState } from '@livepeer/core-react';
import { ProgressProps, useProgress } from '@livepeer/core-react/components';
import * as React from 'react';

import { BaseSlider } from './BaseSlider';
import { useMediaController } from '../../../context';
import { MediaElement } from '../types';

const mediaControllerSelector = ({
  duration,
  progress,
  live,
  requestSeek,
  buffered,
}: MediaControllerState<MediaElement>) => ({
  duration,
  progress,
  live,
  requestSeek,
  buffered,
});

export type { ProgressProps };

export const Progress: React.FC<ProgressProps> = (props) => {
  const { duration, progress, requestSeek, live, buffered } =
    useMediaController(mediaControllerSelector);

  const { isVisible, progressProps, title } = useProgress({
    duration,
    progress,
    requestSeek,
    buffered,
    live,
    ...props,
  });

  return isVisible ? <BaseSlider {...progressProps} ariaName={title} /> : <></>;
};
