import { css } from './stitches';
import { text } from './text';

export const container = css('div', {
  display: 'flex',
  alignItems: 'center',
});

export const liveIndicator = css('div', {
  backgroundColor: '$liveIndicator',
  borderRadius: '100%',

  width: '$liveIndicatorSize',
  height: '$liveIndicatorSize',
});

export const timeText = css(text, {
  marginLeft: '$timeMarginX',
  marginRight: '$timeMarginX',
});

export const time = {
  container,
  text: timeText,
  liveIndicator,
};
