import { keyframes } from '@stitches/core';

import { css } from './stitches';

export const fullscreen = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const container = css('div', {
  fontFamily:
    '$display, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
  backgroundColor: '$background',
  overflow: 'hidden',

  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100%',

  svg: {
    pointerEvents: 'none',
  },

  variants: {
    size: {
      fullscreen: {
        animation: `${fullscreen} 0.2s`,
      },
      default: {
        '&:hover': {
          boxShadow: '$containerShadowHover',
        },

        boxShadow: '$containerShadow',

        borderStyle: '$containerBorderStyle',
        borderColor: '$containerBorderColor',
        borderRadius: '$containerBorderRadius',
        borderWidth: '$containerBorderWidth',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
