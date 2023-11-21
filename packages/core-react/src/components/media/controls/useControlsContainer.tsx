import { MediaControllerState, PlaybackError } from '@livepeer/core';
import * as React from 'react';

export type ControlsContainerProps = {
  loadingText?: string | null;
  showLoadingSpinner?: boolean;
  hidePosterOnPlayed?: boolean;
  poster?: React.ReactNode;
  error?: PlaybackError | null;
  isBroadcast?: boolean;

  playbackFailedErrorComponent?: React.ReactNode;
  streamOfflineErrorComponent?: React.ReactNode;
  accessControlErrorComponent?: React.ReactNode;

  top?: React.ReactNode;
  middle?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
};

type ControlsContainerStateSlice = Pick<
  MediaControllerState,
  'togglePlay' | 'canPlay' | 'buffered' | '_updateLastInteraction'
>;

type ControlsContainerCoreProps = ControlsContainerStateSlice &
  ControlsContainerProps;

export const useControlsContainer = (props: ControlsContainerCoreProps) => {
  const { togglePlay, canPlay, buffered, isBroadcast, _updateLastInteraction } =
    props;

  const isLoaded = React.useMemo(
    () => canPlay || buffered !== 0,
    [canPlay, buffered],
  );

  const onPressBackground = React.useCallback(() => {
    if (isLoaded) {
      if (!isBroadcast) {
        togglePlay();
      } else {
        _updateLastInteraction();
      }
    }
  }, [togglePlay, isLoaded, isBroadcast, _updateLastInteraction]);

  return {
    isLoaded,
    containerProps: {
      onPress: onPressBackground,
    },
  };
};
