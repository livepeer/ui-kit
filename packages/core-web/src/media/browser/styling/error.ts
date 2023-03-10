import { css } from './stitches';
import { text } from './text';

const errorBackground = css('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '220px',
  marginTop: '1rem',

  '@md': {
    maxWidth: '340px',
  },

  maxHeight: '100%',
});

const errorTitle = css(text, {
  fontWeight: '$errorTitleFontWeight',
  margin: '0.5rem 0 0.5rem 0',
  fontSize: '$errorTitleFontSizeSm',

  '@md': {
    fontSize: '$errorTitleFontSizeMd',
    margin: '2rem 0 0.5rem 0',
  },
  '@lg': {
    fontSize: '$errorTitleFontSize',
  },
});

const errorText = css(text, {
  fontWeight: '$titleFontWeight',
  color: '$errorText',
  textAlign: 'center',
  width: '90%',
  fontSize: '$errorTextFontSizeSm',
  marginBottom: '1rem',

  '@md': {
    fontSize: '$errorTextFontSizeMd',
  },
  '@lg': {
    fontSize: '$errorTextFontSize',
  },
});

export const error = {
  background: errorBackground,
  title: errorTitle,
  text: errorText,
};
