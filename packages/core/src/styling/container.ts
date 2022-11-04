import { css } from './stitches';

const aspectRatios = [
  { key: '16to9', value: '16 / 9' },
  { key: '1to1', value: '1 / 1' },
  { key: '9to16', value: '9 / 16' },
  { key: '4to5', value: '4 / 5' },
  { key: '21to9', value: '21 / 9' },
] as const;

export type AspectRatio = typeof aspectRatios[number]['key'];

const aspectRatioContainer = css('div', {
  variants: {
    aspectRatio: {
      [aspectRatios[0].key]: {
        aspectRatio: aspectRatios[0].value,

        [`@supports not (aspect-ratio: ${aspectRatios[0].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[0].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
      [aspectRatios[1].key]: {
        aspectRatio: aspectRatios[1].value,

        [`@supports not (aspect-ratio: ${aspectRatios[1].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[1].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
      [aspectRatios[2].key]: {
        aspectRatio: aspectRatios[2].value,

        [`@supports not (aspect-ratio: ${aspectRatios[2].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[2].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
      [aspectRatios[3].key]: {
        aspectRatio: aspectRatios[3].value,

        [`@supports not (aspect-ratio: ${aspectRatios[3].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[3].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
      [aspectRatios[4].key]: {
        aspectRatio: aspectRatios[4].value,

        [`@supports not (aspect-ratio: ${aspectRatios[4].value})`]: {
          '&:before': {
            float: 'left',
            paddingTop: `calc(${aspectRatios[4].value})%`,
            content: '',
          },

          '&:after': {
            display: 'block',
            content: '',
            clear: 'both',
          },
        },
      },
    },
  },
});

export const container = css(aspectRatioContainer, {
  fontFamily:
    '$display, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji',
  backgroundColor: '$background',
  overflow: 'hidden',
  maxWidth: '100%',
  maxHeight: '100%',

  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,

  svg: {
    pointerEvents: 'none',
  },

  variants: {
    size: {
      fullscreen: {
        // for iOS rendering custom controls
        zIndex: 2147483647,
      },
      default: {
        '&:hover': {
          boxShadow: '$containerShadowHover',
        },

        boxShadow: '$containerShadow',

        borderStyle: '$containerBorderStyle',
        borderColor: '$containerBorderColor',
        borderRadius: '$containerBorderRadius',
        borderWidth: '$containerBorderWidth',

        zIndex: 1,
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});
