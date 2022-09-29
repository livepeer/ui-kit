import { createStitches } from '@stitches/core';

export const {
  css,
  createTheme: createPlayerTheme,
  theme: defaultTheme,
  getCssText,
} = createStitches({
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
  },
  theme: {
    borderStyles: {
      containerBorderStyle: 'hidden',
    },
    borderWidths: {
      containerBorderWidth: 0,
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
      timeFontSize: '1.0rem',
      timeFontSizeMd: '0.95rem',
      timeFontSizeSm: '0.85rem',
      titleFontSize: '1.1rem',
      titleFontSizeMd: '1rem',
      titleFontSizeSm: '0.9rem',
    },
    fontWeights: {
      titleFontWeight: 400,
    },
    shadows: {
      containerShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
      containerShadowHover: '$containerShadow',
    },
    sizes: {
      iconButtonSize: '42px',
      iconButtonSizeSm: '36px',
      liveIndicatorSize: '5px',
      loading: '64px',
      thumb: '12px',
      trackActive: '5px',
      trackContainerHeight: '15px',
      trackContainerHeightSm: '20px',
      trackInactive: '3px',
    },
    space: {
      controlsBottomMarginX: '10px',
      controlsBottomMarginY: '5px',
      controlsTopMarginX: '15px',
      controlsTopMarginY: '10px',
      timeMarginX: '8px',
    },
    radii: {
      containerBorderRadius: '5px',
      slider: '3px',
    },
  },
});

export type ThemeConfig = Parameters<typeof createPlayerTheme>[0];
