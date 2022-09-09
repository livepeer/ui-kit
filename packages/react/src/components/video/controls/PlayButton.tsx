import { styled } from '@stitches/react';
import * as React from 'react';

import { VideoControllerContext } from '../context';

import { PropsOf } from './system';

const DefaultPlayIcon = ({ size }: { size: number }) => (
  <svg
    width={(size * 16) / 21}
    height={size}
    viewBox="0 0 16 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 18.5V2.5L14 10.5L1 18.5Z" fill="#EAEAEA" />
    <path
      d="M1.26205 2.07417L0.5 1.60522V2.5V18.5V19.3948L1.26205 18.9258L14.262 10.9258L14.954 10.5L14.262 10.0742L1.26205 2.07417Z"
      stroke="black"
      stroke-opacity="0.1"
    />
  </svg>
);

const DefaultPauseIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
      fill="currentColor"
    />
  </svg>
);

const StyledButton = styled('button', {
  position: 'absolute',
  bottom: 8,
  left: 8,

  borderRadius: 4,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  color: 'black',
  '&:hover': {
    color: '#808080',
  },
});

export type PlayButtonProps = Omit<PropsOf<'button'>, 'children'> & {
  /**
   * The play icon to be used for the button.
   * @type React.ReactElement
   */
  playIcon?: React.ReactElement;
  /**
   * The pause icon to be used for the button.
   * @type React.ReactElement
   */
  pauseIcon?: React.ReactElement;
} & (
    | {
        playIcon: React.ReactElement;
        pauseIcon: React.ReactElement;
      }
    | Record<string, never>
  );

export const PlayButton = React.forwardRef<HTMLButtonElement, PlayButtonProps>(
  (props, ref) => {
    const mediaController = React.useContext(VideoControllerContext);

    const { playIcon, pauseIcon, onClick, ...rest } = props;

    const onClickComposed = async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      await onClick?.(e);
      await mediaController?.togglePlay();
    };

    const element = mediaController?.playing
      ? pauseIcon ?? <DefaultPauseIcon size={16} />
      : playIcon ?? <DefaultPlayIcon size={16} />;

    const _children = React.isValidElement(element)
      ? React.cloneElement(element)
      : null;

    return (
      <StyledButton
        aria-label={mediaController?.playing ? 'pause' : 'play'}
        ref={ref}
        onClick={onClickComposed}
        {...rest}
      >
        {_children}
      </StyledButton>
    );
  },
);
