import { createStitches } from '@stitches/core';

const theme = {
  borderWidths: {
    loadingWidth: '3px',
  },
  colors: {
    accent: '#00a55f',
    background: '#000000',
    icon: 'rgba(255,255,255,1)',
    iconHover: 'rgba(255,255,255,0.8)',
  },
  fonts: {
    display:
      'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;',
  },
  sizes: {
    loading: '64px',
    thumb: '12px',
    trackActive: '5px',
    trackContainerHeight: '15px',
    trackInactive: '3px',
  },
  space: {
    controlsMarginX: '10px',
    controlsMarginY: '5px',
    iconPaddingTop: '3px',
    sliderNegativeMarginX: '-1px',
    timeMarginX: '8px',
  },
  radii: {
    slider: '100%',
  },
};

export const { css } = createStitches({
  theme,
});

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type ThemeConfig = RecursivePartial<typeof theme>;
