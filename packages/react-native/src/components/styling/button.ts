import { default as Svg } from 'react-native-svg';

import { styled } from './stitches';

export const IconButton = styled('Pressable', {
  variants: {
    size: {
      large: {
        height: '$iconButtonSize',
        width: '$iconButtonSize',
        minHeight: '$iconButtonSize',
        minWidth: '$iconButtonSize',
      },
      default: {
        height: '$iconButtonSizeSm',
        width: '$iconButtonSizeSm',
        minHeight: '$iconButtonSizeSm',
        minWidth: '$iconButtonSizeSm',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },

  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  padding: 0,
});

export const ColoredSvg = styled(Svg, {
  color: 'rgba(255,255,255,1)',
  // '&:hover': {
  //   // color: '$iconHover',
  //   // animation: !isMobile() ? `${scaleUp} 200ms` : undefined,
  // },
});
