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

export const SliderContainer = styled(View, {
  minHeight: 15,

  '@lg': {
    minHeight: 20,
  },

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  minWidth: 80,

  touchAction: 'none',
  cursor: 'pointer',

  height: '100%',
  width: '100%',
});

const SharedTrack = styled(View, {
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

export const SliderLeft = styled(SharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.95,
});

export const SliderMiddle = styled(SharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.55,
});

export const SliderRight = styled(SharedTrack, {
  backgroundColor: '$accent',

  opacity: 0.2,
});

export const SliderThumb = styled(View, {
  variants: {
    size: {
      default: {
        width: 10,
        height: 10,
      },
      active: {
        width: '$thumb',
        height: '$thumb',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },

  backgroundColor: '$icon',

  borderRadius: 100,
});
