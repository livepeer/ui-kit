import { keyframes } from '@stitches/core';

import { css } from './stitches';
import { isMobile } from '../utils';

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

  height: '$iconButtonSizeSm',
  width: '$iconButtonSizeSm',
  minHeight: '$iconButtonSizeSm',
  minWidth: '$iconButtonSizeSm',

  '@lg': {
    height: '$iconButtonSize',
    width: '$iconButtonSize',
    minHeight: '$iconButtonSize',
    minWidth: '$iconButtonSize',
  },

  color: '$icon',
  '&:hover': {
    color: '$iconHover',
    animation: !isMobile() ? `${scaleUp} 200ms` : undefined,
  },
});
