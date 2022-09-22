import { keyframes } from '@stitches/core';

import { css } from './stitches';

export const expand = keyframes({
  '0%': { height: '$trackInactive' },
  '100%': { height: '$trackActive' },
});

export const contract = keyframes({
  '0%': { height: '$trackActive' },
  '100%': { height: '$trackInactive' },
});

const container = css('div', {
  minHeight: '$trackContainerHeight',

  display: 'flex',
  alignItems: 'center',
  minWidth: 80,

  touchAction: 'none',
  cursor: 'pointer',

  height: '100%',
  width: '100%',
});

const sharedTrack = css('div', {
  variants: {
    size: {
      default: {
        height: '$trackInactive',
        animation: `${contract} 0.1s`,
      },
      active: {
        height: '$trackActive',
        animation: `${expand} 0.1s`,
      },
    },
    rounded: {
      full: { borderRadius: '$slider' },
      left: {
        borderTopLeftRadius: '$slider',
        borderBottomLeftRadius: '$slider',
      },
      right: {
        borderTopRightRadius: '$slider',
        borderBottomRightRadius: '$slider',
      },
      none: {},
    },
  },
  defaultVariants: {
    size: 'default',
    rounded: 'none',
  },
});

const left = css(sharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.95,
});

const middle = css(sharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.55,
});

const right = css(sharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.2,
});

const thumb = css('div', {
  width: '$thumb',
  height: '$thumb',

  backgroundColor: '$icon',

  borderRadius: '100%',
});

export const slider = {
  container,
  thumb,
  track: {
    left,
    middle,
    right,
  },
};
