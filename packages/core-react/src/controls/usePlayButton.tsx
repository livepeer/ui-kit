import { MediaControllerState } from "@livepeer/core";

import * as React from "react";

import { useConditionalIcon } from "../hooks";

type PlayButtonStateSlice = Pick<
  MediaControllerState,
  "togglePlay" | "playing"
>;

export type PlayButtonProps = {
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
    togglePlay,
    playing,
    defaultPauseIcon,
    defaultPlayIcon,
    ...rest
  } = props;

  const onPressComposed = async () => {
    await onPress?.();
    await togglePlay();
  };

  const _children = useConditionalIcon(
    playing,
    pauseIcon,
    defaultPauseIcon,
    playIcon,
    defaultPlayIcon,
  );

  const title = React.useMemo(
    () => (playing ? "Pause (k)" : "Play (k)"),
    [playing],
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
