import { ProgressProps, useProgress } from "@livepeer/core-react/components";
import { MediaControllerState } from "@livepeer/core-web";
import * as React from "react";

import { useMediaController } from "../../../../context";
import { BaseSlider } from "./BaseSlider";

const mediaControllerSelector = ({
  duration,
  progress,
  requestSeek,
  buffered,
  live,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  duration,
  progress,
  requestSeek,
  buffered,
  live,
});

export type { ProgressProps };

export const Progress: React.FC<ProgressProps> = (props) => {
  const { duration, progress, requestSeek, buffered, live } =
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
