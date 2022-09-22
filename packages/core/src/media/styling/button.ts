import { keyframes } from '@stitches/core';

import { css } from './stitches';

export const scaleUp = keyframes({
  '0%': { transform: 'scale(1)' },
  '100%': { transform: 'scale(1.1)' },
});

export const iconButton = css('button', {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'inherit',
  padding: 0,

  paddingTop: '$iconPaddingTop',
  color: '$icon',
  '&:hover': {
    color: '$iconHover',
    animation: `${scaleUp} 200ms`,
  },
});
