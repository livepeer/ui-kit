import { MediaControllerState } from "@livepeer/core";

import * as React from "react";

import { useConditionalIcon } from "../hooks";

type PlayButtonStateSlice = Pick<
  MediaControllerState,
  "playbackState" | "__controlsFunctions"
>;

export type PlayButtonProps = {
  playIcon: React.ReactNode;
  pauseIcon: React.ReactNode;
  /**
   * The callback to trigger any logic on click/press.
   */
  onPress?: () => void;
};

type PlayButtonCoreProps = {
  defaultPlayIcon: React.ReactElement;
  defaultPauseIcon: React.ReactElement;
} & PlayButtonStateSlice &
  PlayButtonProps;

export const usePlayButton = (props: PlayButtonCoreProps) => {
  const {
    playIcon,
    pauseIcon,
    onPress,
    __controlsFunctions,
    playbackState,
    defaultPauseIcon,
    defaultPlayIcon,
    ...rest
  } = props;

  const onPressComposed = async () => {
    await onPress?.();
    await __controlsFunctions.togglePlay();
  };

  const _children = useConditionalIcon(
    playbackState === "playing",
    pauseIcon,
    defaultPauseIcon,
    playIcon,
    defaultPlayIcon,
  );

  const title = React.useMemo(
    () => (playbackState === "playing" ? "Pause (k)" : "Play (k)"),
    [playbackState],
  );

  return {
    title,
    buttonProps: {
      onPress: onPressComposed,
      children: _children,
      ...rest,
    },
  };
};
