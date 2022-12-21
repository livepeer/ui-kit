import { css } from './stitches';
import { text } from './text';

const errorBackground = css('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '340px',
});

const errorTitle = css(text, {
  fontWeight: '$errorTitleFontWeight',
  fontSize: '$errorTitleFontSize',
  margin: '0.5rem 0 0.2rem 0',

  '@md': {
    margin: '2rem 0 0.5rem 0',
  },
});

const errorText = css(text, {
  fontWeight: '$titleFontWeight',
  fontSize: '$errorTextFontSize',
  color: '$errorText',
  textAlign: 'center',
  width: '90%',
});

export const error = {
  background: errorBackground,
  title: errorTitle,
  text: errorText,
};
