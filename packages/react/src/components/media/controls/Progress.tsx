import { ProgressProps, useProgress } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';

import { useMediaController } from '../../../context';
import { BaseSlider } from './BaseSlider';

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

export type { ProgressProps };

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
