import { css } from '@stitches/core';

export const playerCss = {
  videoPlayerContainer: css('div', {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',

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
