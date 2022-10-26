import { css } from './stitches';

const poster = css('img', {
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

const video = css('video', {
  width: '100% !important',
  height: '100% !important',

  objectPosition: 'center',

  variants: {
    size: {
      fullscreen: {
        objectFit: 'contain',

        '&::-webkit-media-overlay-enclosure': {
          display: 'none !important',
        },
        '&::-webkit-media-controls-enclosure': {
          display: 'none !important',
        },
      },
      contain: {
        objectFit: 'contain',
      },
      cover: {
        objectFit: 'cover',
      },
    },
  },
  defaultVariants: {
    size: 'cover',
  },
});

const audio = css('audio', video);

export const media = { audio, poster, video };
