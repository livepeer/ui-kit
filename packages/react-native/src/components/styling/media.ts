import { Image } from 'react-native';

import { styled } from './stitches';

export const Poster = styled(Image, {
  maxWidth: '100%',
  width: '100%',
  maxHeight: '100%',
  height: '100%',
  pointerEvents: 'none',
  userSelect: 'none',
  objectPosition: 'center',
  objectFit: 'cover',

  variants: {
    size: {
      fullscreen: {
        width: '100% !important',
        height: '100% !important',
      },
      default: {},
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
