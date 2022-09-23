import { keyframes } from '@stitches/core';

import { css } from './stitches';

const aspectRatios = [
  { key: '16to9', value: '16 / 9' },
  { key: '1to1', value: '1 / 1' },
] as const;

export type AspectRatio = typeof aspectRatios[number]['key'];

const aspectRatioContainer = css('div', {
  variants: {
    aspectRatio: {
      [aspectRatios[0].key]: {
        aspectRatio: aspectRatios[0].value,

        [`@supports not (aspect-ratio: ${aspectRatios[0].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[0].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
      [aspectRatios[1].key]: {
        aspectRatio: aspectRatios[1].value,

        [`@supports not (aspect-ratio: ${aspectRatios[1].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[1].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
    },
  },
});

const fullscreen = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const container = css(aspectRatioContainer, {
  fontFamily:
    '$display, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
  backgroundColor: '$background',
  overflow: 'hidden',
  maxWidth: '100%',
  width: '100%',
  height: '100%',
  maxHeight: '100%',

  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    pointerEvents: 'none',
  },

  // for iOS rendering custom controls
  zIndex: 2147483647,

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

        // fix slight border issues with >0 border radius
        margin: '-1px',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
