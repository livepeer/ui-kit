import { css } from './stitches';

export const video = css('video', {
  variants: {
    size: {
      fullscreen: {
        width: '100% !important',
        height: '100% !important',

        '&::-webkit-media-controls-enclosure': {
          display: 'none !important',
        },
      },
      default: {
        maxWidth: '100%',
        width: '$containerWidth',
        height: '$containerHeight',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const media = {
  video,
};
