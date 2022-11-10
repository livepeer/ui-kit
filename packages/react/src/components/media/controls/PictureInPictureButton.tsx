import {
  MediaControllerState,
  isPictureInPictureSupported,
} from 'livepeer/media/controls';
import { styling } from 'livepeer/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { PropsOf } from '../../system';

const DefaultPictureInPictureIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z"
    ></path>
  </svg>
);

export type PictureInPictureButtonProps = Omit<
  PropsOf<'button'>,
  'children'
> & {
  /**
   * The picture in picture icon to be used for the button.
   * @type React.ReactElement
   */
  icon?: React.ReactElement;
};

const mediaControllerSelector = ({
  requestTogglePictureInPicture,
  pictureInPicture,
  _element,
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  requestTogglePictureInPicture,
  pictureInPicture,
  _element,
  fullscreen,
});

export const PictureInPictureButton = React.forwardRef<
  HTMLButtonElement,
  PictureInPictureButtonProps
>((props, ref) => {
  const {
    requestTogglePictureInPicture,
    _element,
    pictureInPicture,
    fullscreen,
  } = useMediaController(mediaControllerSelector);

  const { icon, onClick, ...rest } = props;

  const onClickComposed = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      await onClick?.(e);
      await requestTogglePictureInPicture();
    },
    [onClick, requestTogglePictureInPicture],
  );

  const isPiPSupported = React.useMemo(
    () => isPictureInPictureSupported(_element),
    [_element],
  );

  const title = React.useMemo(
    () => (pictureInPicture ? 'Exit mini player (i)' : 'Mini player (i)'),
    [pictureInPicture],
  );

  // do not show button if it is not supported or if currently fullscreen
  if (!isPiPSupported || fullscreen) {
    return <></>;
  }

  const _children = icon ? icon : <DefaultPictureInPictureIcon />;

  return (
    <button
      {...rest}
      className={styling.iconButton()}
      title={title}
      aria-label={title}
      ref={ref}
      onClick={onClickComposed}
    >
      {_children}
    </button>
  );
});

PictureInPictureButton.displayName = 'PictureInPictureButton';
