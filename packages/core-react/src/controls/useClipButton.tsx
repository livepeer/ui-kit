import { ClipLength, MediaControllerState } from "@livepeer/core";

import * as React from "react";

type ClipButtonStateSlice = Pick<MediaControllerState, "live">;

export type ClipButtonProps = {
  /**
   * The callback to trigger any logic on click/press.
   */
  onPress?: () => void;
  /**
   * The icon to be used for the button.
   * @type React.ReactElement
   */
  defaultIcon?: React.ReactElement;
  /**
   * The size of the icon.
   */
  size?: number | string;
  /**
   * The length of the clip to be made, from the latest viewer's live point.
   * @type ClipLength
   */
  length: ClipLength;
};

type ClipButtonCoreProps = ClipButtonStateSlice & ClipButtonProps;

export const useClipButton = (props: ClipButtonCoreProps) => {
  const {
    onPress,
    live,
    // requestClip,
    // playbackId,
    defaultIcon,
    // clipStatus,
    length,
    ...rest
  } = props;

  // const onPressComposed = React.useCallback(async () => {
  //   await onPress?.();
  //   // await requestClip();
  // }, [onPress, requestClip]);

  const title = React.useMemo(
    () => `Clip last ${Number(length).toFixed(0)}s (x)`,
    [length],
  );

  // const isShown = React.useMemo(() => playbackId && live, [playbackId, live]);

  return {
    title,
    // isShown: isShown,
    // status: clipStatus,
    buttonProps: {
      // onPress: onPressComposed,
      children: defaultIcon,
      ...rest,
    },
  };
};
