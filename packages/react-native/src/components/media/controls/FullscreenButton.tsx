import {
  FullscreenButtonProps,
  useFullscreenButton,
} from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { Path } from 'react-native-svg';

import { useMediaController } from '../../../context';
import { IconButton } from '../../styling';
import { ColoredSvg } from '../../styling/button';
import { MediaElement } from '../types';

const DefaultEnterFullscreenIcon = () => (
  <ColoredSvg viewBox="0 0 36 36" fill="none">
    <Path
      fill="currentColor"
      d="M10 16h2v-4h4v-2h-6v6zM20 10v2h4v4h2v-6h-6zM24 24h-4v2h6v-6h-2v4zM12 20h-2v6h6v-2h-4v-4z"
    />
  </ColoredSvg>
);

const DefaultExitFullscreenIcon = () => (
  <ColoredSvg viewBox="0 0 36 36">
    <Path
      fill="currentColor"
      d="M14 14h-4v2h6v-6h-2v4zM22 14v-4h-2v6h6v-2h-4zM20 26h2v-4h4v-2h-6v6zM10 22h4v4h2v-6h-6v2z"
    />
  </ColoredSvg>
);

const mediaControllerSelector = ({
  fullscreen,
  pictureInPicture,
  requestToggleFullscreen,
}: MediaControllerState<MediaElement>) => ({
  fullscreen,
  pictureInPicture,
  requestToggleFullscreen,
});

export type { FullscreenButtonProps };

export const FullscreenButton: React.FC<FullscreenButtonProps> = (props) => {
  const { fullscreen, pictureInPicture, requestToggleFullscreen } =
    useMediaController(mediaControllerSelector);

  const { title, buttonProps } = useFullscreenButton({
    fullscreen,
    pictureInPicture,
    requestToggleFullscreen,
    defaultEnterIcon: <DefaultEnterFullscreenIcon />,
    defaultExitIcon: <DefaultExitFullscreenIcon />,
    ...props,
  });

  if (!buttonProps) {
    return <></>;
  }

  return (
    <IconButton
      size={{
        '@lg': 'large',
      }}
      {...buttonProps}
      accessibilityLabel={title}
    />
  );
};
