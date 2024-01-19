import { MediaControllerState } from "@livepeer/core";
import * as React from "react";

import { useConditionalIcon } from "../hooks";

type VolumeStateSlice = Pick<
  MediaControllerState,
  "volume" | "__controlsFunctions" | "__device"
>;

export type VolumeProps = {
  /**
   * The callback to trigger any logic on click/press.
   */
  onPress?: () => void;
  /**
   * Toggles showing the slider to change the volume level. Defaults to true.
   * If false, the volume will toggle between 0% and 100%.
   */
  showSlider?: boolean;
  /**
   * The icon to be used for the button when unmuted.
   * @type React.ReactElement
   */
  unmutedIcon?: React.ReactElement;
  /**
   * The icon to be used for the button when muted.
   * @type React.ReactElement
   */
  mutedIcon?: React.ReactElement;
  /**
   * The size of the icon.
   */
  size?: number | string;
};

type VolumeCoreProps = {
  defaultMutedIcon: React.ReactElement;
  defaultUnmutedIcon: React.ReactElement;
} & VolumeStateSlice &
  VolumeProps;

export const useVolume = (props: VolumeCoreProps) => {
  const {
    unmutedIcon,
    mutedIcon,
    onPress,
    __device,
    showSlider = true,
    defaultUnmutedIcon,
    volume,
    defaultMutedIcon,
    __controlsFunctions,
    ...rest
  } = props;

  const onPressComposed = React.useCallback(async () => {
    await onPress?.();

    __controlsFunctions.requestToggleMute();
  }, [onPress, __controlsFunctions]);

  const _children = useConditionalIcon(
    volume !== 0,
    unmutedIcon,
    defaultUnmutedIcon,
    mutedIcon,
    defaultMutedIcon,
  );

  const title = React.useMemo(
    () => (volume === 0 ? "Unmute (m)" : "Mute (m)"),
    [volume],
  );

  const onChange = React.useCallback(
    async (value: number) => {
      __controlsFunctions.requestVolume(value);
    },
    [__controlsFunctions],
  );

  return {
    title,
    buttonProps: {
      onPress: onPressComposed,
      children: _children,
      ...rest,
    },
    progressProps: {
      shown: __device.isVolumeChangeSupported && showSlider,
      onChange,
      leftCss: { backgroundColor: "$volumeLeft" },
      middleCss: { backgroundColor: "$volumeMiddle" },
      rightCss: { backgroundColor: "$volumeRight" },
      thumbCss: { backgroundColor: "$volumeThumb" },
    },
  };
};
