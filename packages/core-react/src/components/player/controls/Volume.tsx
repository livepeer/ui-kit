import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useConditionalIcon } from '../../../hooks';

type VolumeStateSlice = Pick<
  MediaControllerState,
  | 'volume'
  | 'requestVolume'
  | 'requestToggleMute'
  | 'muted'
  | 'isVolumeChangeSupported'
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
    showSlider = true,
    defaultUnmutedIcon,
    defaultMutedIcon,
    requestVolume,
    requestToggleMute,
    isVolumeChangeSupported,
    muted,
    ...rest
  } = props;

  const onPressComposed = React.useCallback(async () => {
    await onPress?.();

    requestToggleMute();
  }, [onPress, requestToggleMute]);

  const _children = useConditionalIcon(
    !muted,
    unmutedIcon,
    defaultUnmutedIcon,
    mutedIcon,
    defaultMutedIcon,
  );

  const title = React.useMemo(
    () => (muted ? 'Unmute (m)' : 'Mute (m)'),
    [muted],
  );

  const onChange = React.useCallback(
    async (value: number) => {
      requestVolume(value);
    },
    [requestVolume],
  );

  return {
    title,
    buttonProps: {
      onPress: onPressComposed,
      children: _children,
      ...rest,
    },
    progressProps: {
      shown: isVolumeChangeSupported && showSlider,
      onChange,
    },
  };
};
