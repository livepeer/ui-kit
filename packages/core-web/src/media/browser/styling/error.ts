import { css } from './stitches';
import { text } from './text';

const errorBackground = css('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const errorTitle = css(text, {
  fontWeight: '$titleFontWeight',
  fontSize: '$titleFontSizeMd',

  '@md': {
    fontSize: '$titleFontSizeMd',
  },
  '@lg': {
    fontSize: '$titleFontSize',
  },
});

const errorText = css(text, {
  fontWeight: '$titleFontWeight',
  fontSize: '$titleFontSizeSm',

  '@md': {
    fontSize: '$titleFontSizeMd',
  },
  '@lg': {
    fontSize: '$titleFontSize',
  },
});

export const error = {
  background: errorBackground,
  title: errorTitle,
  text: errorText,
};
