import { styled } from './stitches';
import { text } from './text';

export const Title = styled(text, {
  fontWeight: '$titleFontWeight',

  variants: {
    size: {
      large: {
        fontSize: '$titleFontSize',
      },
      medium: {
        fontSize: '$titleFontSizeMd',
      },
      default: {
        fontSize: '$titleFontSizeSm',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
