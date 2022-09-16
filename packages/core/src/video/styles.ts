import { css } from '@stitches/core';

export const playerCss = {
  videoPlayerContainer: css('div', {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    fontFamily:
      'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;',
    maxWidth: '100%',

    'video::-webkit-media-controls-enclosure': {
      display: 'none !important',
    },
    'video::full-screen': {
      width: '100%',
      height: '100%',
    },
    'video::-moz-full-screen': {
      width: '100%',
      height: '100%',
    },
    'video::-webkit-full-screen': {
      width: '100%',
      height: '100%',
    },
  }),
};
