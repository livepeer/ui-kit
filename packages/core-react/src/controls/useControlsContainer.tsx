import { MediaControllerState, PlaybackError } from "@livepeer/core";
import * as React from "react";

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
  "buffered" | "__controlsFunctions" | "playbackState"
>;

type ControlsContainerCoreProps = ControlsContainerStateSlice &
  ControlsContainerProps;

export const useControlsContainer = (props: ControlsContainerCoreProps) => {
  const { playbackState, buffered, isBroadcast, __controlsFunctions } = props;

  const isLoaded = React.useMemo(
    () => playbackState !== "buffering" || buffered !== 0,
    [playbackState, buffered],
  );

  const onPressBackground = React.useCallback(() => {
    if (isLoaded) {
      if (!isBroadcast) {
        __controlsFunctions.togglePlay();
      } else {
        __controlsFunctions.updateLastInteraction();
      }
    }
  }, [__controlsFunctions, isLoaded, isBroadcast]);

  return {
    isLoaded,
    containerProps: {
      onPress: onPressBackground,
    },
  };
};
