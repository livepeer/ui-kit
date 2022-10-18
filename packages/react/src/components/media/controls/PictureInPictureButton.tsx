import { styling } from 'livepeer/styling';
import * as React from 'react';

import { isPictureInPictureSupported } from '../../../../../core/src/media/controls/pictureinpicture'; // TODO: Implement absolute imports

import { PropsOf } from '../../system';
import { useMediaController } from '../context';

const DefaultPictureInPictureIcon = () => (
  <svg
    width="25"
    height="20"
    viewBox="0 0 25 20"
    style={{ marginTop: 6 }}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.0417 1H1.95833C1.42906 1 1 1.42906 1 1.95833V17.2917C1 17.8209 1.42906 18.25 1.95833 18.25H23.0417C23.5709 18.25 24 17.8209 24 17.2917V1.95833C24 1.42906 23.5709 1 23.0417 1Z"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M13.4584 18.25V10.5833C13.4584 10.3292 13.5593 10.0854 13.7391 9.90569C13.9188 9.72597 14.1625 9.625 14.4167 9.625H24"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
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
} & (
    | {
        icon: React.ReactElement;
      }
    | Record<string, never>
  );

export const PictureInPictureButton = React.forwardRef<
  HTMLButtonElement,
  PictureInPictureButtonProps
>((props, ref) => {
  const { requestTogglePictureInPicture } = useMediaController();

  const { icon, onClick, ...rest } = props;

  const onClickComposed = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      await onClick?.(e);
      await requestTogglePictureInPicture();
    },
    [onClick, requestTogglePictureInPicture],
  );

  const _children = icon ? icon : <DefaultPictureInPictureIcon />;

  const isPiPSupported = isPictureInPictureSupported(
    document.querySelector('video'),
  );

  if (!isPiPSupported) {
    return null;
  }

  const title = 'Toggle Picture-in-Picture';
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
