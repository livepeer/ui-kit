import { styled } from './stitches';
import { text } from './text';

export const Title = styled(text, {
  // fontWeight: '$titleFontWeight',
  fontSize: '$titleFontSizeSm',

  '@md': {
    fontSize: '$titleFontSizeMd',
  },
  '@lg': {
    fontSize: '$titleFontSize',
  },
});
