import { css } from './stitches';

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
      },
      active: {
        height: '$trackActive',
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
