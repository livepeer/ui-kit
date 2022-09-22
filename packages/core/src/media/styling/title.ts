import { css } from './stitches';
import { text } from './text';

export const title = css(text, {
  fontWeight: '$titleFontWeight',

  '@initial': {
    fontSize: '$titleFontSizeSm',
  },
  '@md': {
    fontSize: '$titleFontSizeMd',
  },
  '@lg': {
    fontSize: '$titleFontSize',
  },
});
