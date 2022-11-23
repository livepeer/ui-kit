import { ProgressProps, useProgress } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { MediaElement } from '../types';
import { BaseSlider } from './BaseSlider';

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

export type { ProgressProps };

export const Progress: React.FC<ProgressProps> = (props) => {
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
