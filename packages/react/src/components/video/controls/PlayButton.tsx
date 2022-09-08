import { styled } from '@stitches/react';
import * as React from 'react';

import { VideoControllerContext } from '../context';

import { PropsOf } from './system';

const DefaultPlayIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
      fill="currentColor"
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
      ? pauseIcon ?? <DefaultPauseIcon size={30} />
      : playIcon ?? <DefaultPlayIcon size={30} />;

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
