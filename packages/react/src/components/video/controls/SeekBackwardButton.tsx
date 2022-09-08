import { styled } from '@stitches/react';
import * as React from 'react';

import { VideoControllerContext } from '../context';

import { PropsOf } from './system';

const DefaultSeekBackwardIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
      fill="currentColor"
    />
  </svg>
);

const StyledButton = styled('button', {
  position: 'absolute',
  bottom: 8,
  left: 40,

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

export type SeekBackwardButtonProps = Omit<PropsOf<'button'>, 'children'> & {
  /**
   * The icon to be used for the button.
   * @type React.ReactElement
   */
  icon?: React.ReactElement;
};

export const SeekBackwardButton = React.forwardRef<
  HTMLButtonElement,
  SeekBackwardButtonProps
>((props, ref) => {
  const mediaController = React.useContext(VideoControllerContext);

  const { icon, onClick, ...rest } = props;

  const onClickComposed = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    await onClick?.(e);
    await mediaController?.onSeekBackward(5);
  };

  const element = icon ?? <DefaultSeekBackwardIcon size={30} />;

  const _children = React.isValidElement(element)
    ? React.cloneElement(element)
    : null;

  return (
    <StyledButton
      aria-label="seek backward"
      ref={ref}
      onClick={onClickComposed}
      {...rest}
    >
      {_children}
    </StyledButton>
  );
});
