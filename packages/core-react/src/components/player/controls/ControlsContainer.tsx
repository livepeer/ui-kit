import { MediaControllerState } from '@livepeer/core';
import * as React from 'react';

import { PlaybackDisplayErrorType } from '../PlaybackDisplayErrorType';

export type ControlsContainerProps = {
  loadingText?: string | null;
  showLoadingSpinner?: boolean;
  hidePosterOnPlayed?: boolean;
  poster?: React.ReactNode;
  playbackDisplayErrorType?: PlaybackDisplayErrorType | null;

  top?: React.ReactNode;
  middle?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

type ControlsContainerStateSlice = Pick<
  MediaControllerState,
  'togglePlay' | 'canPlay' | 'buffered'
>;

type ControlsContainerCoreProps = ControlsContainerStateSlice &
  ControlsContainerProps;

export const useControlsContainer = (props: ControlsContainerCoreProps) => {
  const { togglePlay, canPlay, buffered } = props;

  const isLoaded = React.useMemo(
    () => canPlay || buffered !== 0,
    [canPlay, buffered],
  );

  const onPressBackground = React.useCallback(() => {
    if (isLoaded) {
      togglePlay();
    }
  }, [togglePlay, isLoaded]);

  return {
    isLoaded,
    containerProps: {
      onPress: onPressBackground,
    },
  };
};
