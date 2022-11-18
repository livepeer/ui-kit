import { View } from 'react-native';

import { styled } from './stitches';

const aspectRatios = [
  { key: '16to9', value: 16 / 9 },
  { key: '1to1', value: 1 / 1 },
  { key: '9to16', value: 9 / 16 },
  { key: '4to5', value: 4 / 5 },
  { key: '21to9', value: 21 / 9 },
] as const;

export type AspectRatio = typeof aspectRatios[number]['key'];

const aspectRatioContainer = styled(View, {
  variants: {
    aspectRatio: {
      [aspectRatios[0].key]: {
        aspectRatio: aspectRatios[0].value,
      },
      [aspectRatios[1].key]: {
        aspectRatio: aspectRatios[1].value,
      },
      [aspectRatios[2].key]: {
        aspectRatio: aspectRatios[2].value,
      },
      [aspectRatios[3].key]: {
        aspectRatio: aspectRatios[3].value,
      },
      [aspectRatios[4].key]: {
        aspectRatio: aspectRatios[4].value,
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

  '&:hover': {
    boxShadow: '$containerShadowHover',
  },

  boxShadow: '$containerShadow',

  borderStyle: '$containerBorderStyle',
  borderColor: '$containerBorderColor',
  borderRadius: '$containerBorderRadius',
  borderWidth: '$containerBorderWidth',
});
