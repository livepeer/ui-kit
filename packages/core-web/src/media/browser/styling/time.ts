import { keyframes } from '@stitches/core';

import { css } from './stitches';
import { text } from './text';

export const pulse = keyframes({
  '0%, 100%': {
    opacity: 1,
  },
  '50%': {
    opacity: 0.5,
  },
});

export const container = css('div', {
  marginLeft: '$timeMarginX',
  marginRight: '$timeMarginX',
  display: 'flex',
  alignItems: 'center',
});

export const liveIndicator = css('div', {
  backgroundColor: '$liveIndicator',
  borderRadius: '100%',

  width: '$liveIndicatorSize',
  height: '$liveIndicatorSize',

  animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
});

export const timeText = css(text, {
  marginLeft: '$timeMarginX',
  marginRight: '$timeMarginX',
  fontVariant: 'tabular-nums',

  fontSize: '$timeFontSizeSm',

  '@md': {
    fontSize: '$timeFontSizeMd',
  },
  '@lg': {
    fontSize: '$timeFontSize',
  },
});

export const time = {
  container,
  text: timeText,
  liveIndicator,
};
