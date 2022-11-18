import { default as Svg } from 'react-native-svg';

import { styled } from './stitches';

export const IconButton = styled('Pressable', {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  padding: 0,

  height: '$iconButtonSizeSm',
  width: '$iconButtonSizeSm',
  minHeight: '$iconButtonSizeSm',
  minWidth: '$iconButtonSizeSm',

  '@lg': {
    height: 42, // '$iconButtonSize',
    width: 42, // '$iconButtonSize',
    minHeight: 42, // '$iconButtonSize',
    minWidth: 42, // '$iconButtonSize',
  },
});

export const ColoredSvg = styled(Svg, {
  color: 'rgba(255,255,255,1)',
  '&:hover': {
    color: '$iconHover',
    // animation: !isMobile() ? `${scaleUp} 200ms` : undefined,
  },
});
