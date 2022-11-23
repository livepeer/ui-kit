import { aspectRatios } from 'livepeer/media';
import { View } from 'react-native';

import { styled } from './stitches';

const aspectRatioContainer = styled(View, {
  variants: {
    aspectRatio: {
      [aspectRatios[0].key]: {
        aspectRatio: aspectRatios[0].numeric,
      },
      [aspectRatios[1].key]: {
        aspectRatio: aspectRatios[1].numeric,
      },
      [aspectRatios[2].key]: {
        aspectRatio: aspectRatios[2].numeric,
      },
      [aspectRatios[3].key]: {
        aspectRatio: aspectRatios[3].numeric,
      },
      [aspectRatios[4].key]: {
        aspectRatio: aspectRatios[4].numeric,
      },
    },
  },
});

export const Container = styled(aspectRatioContainer, {
  fontFamily:
    '$display, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
  backgroundColor: '$background',
  overflow: 'hidden',
  maxWidth: '100%',
  width: '100%',

  alignItems: 'center',
  justifyContent: 'center',

  svg: {
    pointerEvents: 'none',
  },

  // '&:hover': {
  //   boxShadow: '$containerShadowHover',
  // },

  // boxShadow: '$containerShadow',

  // borderStyle: '$containerBorderStyle',
  borderColor: '$containerBorderColor',
  borderRadius: '$containerBorderRadius',
  borderWidth: '$containerBorderWidth',
});
