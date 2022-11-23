import { View } from 'react-native';

import { styled } from './stitches';
import { text } from './text';

export const TimeContainer = styled(View, {
  display: 'flex',
  alignItems: 'center',
});

export const TimeLiveIndicator = styled(View, {
  backgroundColor: '$liveIndicator',
  borderRadius: '100%',

  width: '$liveIndicatorSize',
  height: '$liveIndicatorSize',
});

export const TimeText = styled(text, {
  marginLeft: '$timeMarginX',
  marginRight: '$timeMarginX',
  fontVariant: ['tabular-nums'],

  fontSize: '$timeFontSizeSm',

  '@md': {
    fontSize: '$timeFontSizeMd',
  },
  '@lg': {
    fontSize: '$timeFontSize',
  },
});
