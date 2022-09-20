import { keyframes } from '@stitches/core';

import { css } from './stitches';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loading = css('div', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  maxHeight: '100%',

  'div::after': {
    content: ' ',
    display: 'block',
    width: '$loading',
    height: '$loading',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '50%',
    borderWidth: '$loadingWidth',
    borderStyle: 'solid',
    borderColor: '$accent transparent $accent transparent',
    animation: `${rotate} 1.4s ease-in-out infinite`,
  },
});
