import { View } from 'react-native';

import { styled } from './stitches';

// export const expand = keyframes({
//   '0%': { height: '$trackInactive' },
//   '100%': { height: '$trackActive' },
// });

// export const contract = keyframes({
//   '0%': { height: '$trackActive' },
//   '100%': { height: '$trackInactive' },
// });

const container = styled(View, {
  minHeight: '$trackContainerHeightSm',

  '@lg': {
    minHeight: '$trackContainerHeight',
  },

  '@media (hover: none)': {
    minHeight: '$trackContainerHeightSm',
  },

  display: 'flex',
  alignItems: 'center',
  minWidth: 80,

  touchAction: 'none',
  cursor: 'pointer',

  height: '100%',
  width: '100%',
});

const sharedTrack = styled(View, {
  variants: {
    size: {
      default: {
        height: '$trackInactive',
        // animation: `${contract} 0.1s`,
      },
      active: {
        height: '$trackActive',
        // animation: `${expand} 0.1s`,
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

const left = styled(sharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.95,
});

const middle = styled(sharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.55,
});

const right = styled(sharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.2,
});

const thumb = styled(View, {
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
