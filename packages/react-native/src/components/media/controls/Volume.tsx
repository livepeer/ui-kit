import { VolumeProps, useVolume } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';

import { Path } from 'react-native-svg';

import { useMediaController } from '../../../context';
import { VolumeContainer } from '../../styling';
import { ColoredSvg, IconButton } from '../../styling/button';
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
  volume,
}: MediaControllerState<MediaElement>) => ({
  isVolumeChangeSupported,
  requestToggleMute,
  requestVolume,
  muted,
  volume,
});

export const Volume = (props: VolumeProps) => {
  const {
    volume,
    requestToggleMute,
    muted,
    requestVolume,
    isVolumeChangeSupported,
  } = useMediaController(mediaControllerSelector);

  const { buttonProps, title } = useVolume({
    volume,
    requestToggleMute,
    muted,
    requestVolume,
    isVolumeChangeSupported,
    defaultMutedIcon: <DefaultMutedIcon />,
    defaultUnmutedIcon: <DefaultUnmutedIcon />,
    ...props,
  });

  return (
    <VolumeContainer>
      <IconButton accessibilityLabel={title} {...buttonProps} />
    </VolumeContainer>
  );
};
