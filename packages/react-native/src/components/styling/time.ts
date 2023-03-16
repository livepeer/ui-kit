import { View } from 'react-native';

import { styled } from './stitches';
import { text } from './text';

export const TimeContainer = styled(View, {
  display: 'flex',
  flexDirection: 'row',
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

  variants: {
    size: {
      large: {
        fontSize: '$timeFontSize',
      },
      medium: {
        fontSize: '$timeFontSizeMd',
      },
      default: {
        fontSize: '$timeFontSizeSm',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
