import { css } from './stitches';

export const container = css('div', {
  fontFamily: '$display',
  backgroundColor: '$background',

  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  maxWidth: '100%',

  svg: {
    pointerEvents: 'none',
  },
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
    width: '100% !important',
    height: '100% !important',
  },
});
