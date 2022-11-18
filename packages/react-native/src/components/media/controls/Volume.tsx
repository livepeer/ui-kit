import { useConditionalIcon } from '@livepeer/core-react/hooks';
import { MediaControllerState } from 'livepeer';

import * as React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Path } from 'react-native-svg';

import { useMediaController } from '../../../context';
import { VolumeContainer } from '../../styling';
import { ColoredSvg, IconButton } from '../../styling/button';
import { PropsOf } from '../../system';
import { MediaElement } from '../types';

const DefaultMutedIcon = () => (
  <ColoredSvg width="100%" height="100%" viewBox="0 0 36 36">
    <Path d="m9.25 9-1.27 1.27L24.71 27l1.27-1.27Z" fill="currentColor" />
    <Path
      fill="currentColor"
      d="M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Zm0-2.71c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06Z"
    />
  </ColoredSvg>
);

const DefaultUnmutedIcon = () => (
  <ColoredSvg width="100%" height="100%" viewBox="0 0 36 36">
    <Path
      fill="currentColor"
      d="M8 21h4l5 5V10l-5 5H8v6Zm11-7v8c1.48-.68 2.5-2.23 2.5-4 0-1.74-1.02-3.26-2.5-4Zm0-2.71c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77 0-4.28-2.99-7.86-7-8.77v2.06Z"
    />
  </ColoredSvg>
);

const mediaControllerSelector = ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
}: MediaControllerState<MediaElement>) => ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
});

export type VolumeProps = Omit<PropsOf<typeof IconButton>, 'children'> & {
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

export const Volume = React.forwardRef<typeof IconButton, VolumeProps>(
  (props, ref) => {
    const { requestToggleMute, muted } = useMediaController(
      mediaControllerSelector,
    );

    const {
      unmutedIcon,
      mutedIcon,
      onPress,

      ...rest
    } = props;

    const onPressComposed = React.useCallback(
      async (e: GestureResponderEvent) => {
        await onPress?.(e);

        requestToggleMute();
      },
      [onPress, requestToggleMute],
    );

    const _children = useConditionalIcon(
      !muted,
      unmutedIcon,
      <DefaultUnmutedIcon />,
      mutedIcon,
      <DefaultMutedIcon />,
    );

    const title = React.useMemo(
      () => (muted ? 'Unmute (m)' : 'Mute (m)'),
      [muted],
    );

    return (
      <VolumeContainer>
        <IconButton
          title={title}
          // aria-label={title}
          ref={ref}
          onPress={onPressComposed}
          {...rest}
        >
          {_children}
        </IconButton>

        {/* {isVolumeChangeSupported && showSlider && <VolumeProgress />} */}
      </VolumeContainer>
    );
  },
);

Volume.displayName = 'Volume';
