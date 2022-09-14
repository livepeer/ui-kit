import { styled } from '@stitches/react';
import { MediaControllerState } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

import { PropsOf, useConditionalIcon } from './system';

const DefaultEnterFullscreenIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
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

const DefaultExitFullscreenIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
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

const StyledButton = styled('button', {
  borderRadius: 4,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  color: 'white',
  padding: 0,
  '&:hover': {
    color: '#909090',
  },
});

const mediaControllerSelector = ({
  fullscreen,
  requestToggleFullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
  requestToggleFullscreen,
});

export type FullscreenButtonProps = Omit<PropsOf<'button'>, 'children'> & {
  /**
   * The enter fullscreen icon to be used for the button.
   * @type React.ReactElement
   */
  enterIcon?: React.ReactElement;
  /**
   * The exit fullscreen icon to be used for the button.
   * @type React.ReactElement
   */
  exitIcon?: React.ReactElement;
} & (
    | {
        enterIcon: React.ReactElement;
        exitIcon: React.ReactElement;
      }
    | Record<string, never>
  );

export const FullscreenButton = React.forwardRef<
  HTMLButtonElement,
  FullscreenButtonProps
>((props, ref) => {
  const { fullscreen, requestToggleFullscreen } = useMediaController(
    mediaControllerSelector,
  );

  const { enterIcon, exitIcon, onClick, ...rest } = props;

  const onClickComposed = React.useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      await onClick?.(e);
      await requestToggleFullscreen();
    },
    [onClick, requestToggleFullscreen],
  );

  const _children = useConditionalIcon(
    fullscreen,
    exitIcon,
    <DefaultExitFullscreenIcon size={42} />,
    enterIcon,
    <DefaultEnterFullscreenIcon size={42} />,
  );

  return (
    <StyledButton
      aria-label={`${fullscreen ? 'exit' : 'enter'} fullscreen`}
      ref={ref}
      onClick={onClickComposed}
      {...rest}
    >
      {_children}
    </StyledButton>
  );
});

FullscreenButton.displayName = 'FullscreenButton';
