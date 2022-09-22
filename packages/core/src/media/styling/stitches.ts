import { createStitches } from '@stitches/core';

export const {
  css,
  createTheme: createPlayerTheme,
  theme: defaultTheme,
} = createStitches({
  theme: {
    borderStyles: {
      containerBorderStyle: 'hidden',
    },
    borderWidths: {
      loadingWidth: '3px',
    },
    colors: {
      accent: '#00a55f',
      background: '#000000',
      containerBorderColor: 'transparent',
      icon: 'rgba(255,255,255,1)',
      iconHover: 'rgba(255,255,255,0.8)',
      liveIndicator: '#e5484d',
    },
    fonts: {
      display: 'ui-sans-serif',
    },
    fontSizes: {
      titleFontSize: '1.3em',
    },
    fontWeights: {
      titleFontWeight: 400,
    },
    shadows: {
      containerShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
      containerShadowHover: '$containerShadow',
    },
    sizes: {
      containerBorderWidth: 0,
      containerWidth: '100%',
      containerHeight: '100%',
      liveIndicatorSize: '5px',
      loading: '64px',
      thumb: '12px',
      trackActive: '5px',
      trackContainerHeight: '15px',
      trackInactive: '3px',
    },
    space: {
      controlsBottomMarginX: '10px',
      controlsBottomMarginY: '5px',
      controlsTopMarginX: '15px',
      controlsTopMarginY: '10px',
      iconPaddingTop: '3px',
      timeMarginX: '8px',
    },
    radii: {
      containerBorderRadius: '5px',
      slider: '3px',
    },
  },
});

export type ThemeConfig = Parameters<typeof createPlayerTheme>[0];
