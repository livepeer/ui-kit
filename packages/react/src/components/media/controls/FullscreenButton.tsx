import {
  FullscreenButtonProps,
  useFullscreenButton,
} from '@livepeer/core-react/components';
import { MediaControllerState, omit } from '@livepeer/core-web';
import { styling } from '@livepeer/core-web/media/browser/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';

const DefaultEnterFullscreenIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"
    ></path>

    <path
      fill="currentColor"
      d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"
    ></path>

    <path
      fill="currentColor"
      d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"
    ></path>

    <path
      fill="currentColor"
      d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"
    ></path>
  </svg>
);

const DefaultExitFullscreenIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z"
    ></path>

    <path
      fill="currentColor"
      d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z"
    ></path>

    <path
      fill="currentColor"
      d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z"
    ></path>

    <path
      fill="currentColor"
      d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z"
    ></path>
  </svg>
);

const mediaControllerSelector = ({
  fullscreen,
  pictureInPicture,
  requestToggleFullscreen,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
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
    <button
      style={{
        width: props.size,
        height: props.size,
      }}
      className={styling.iconButton()}
      title={title}
      aria-label={title}
      onClick={buttonProps.onPress}
      {...omit(buttonProps, 'onPress', 'size')}
    />
  );
};
