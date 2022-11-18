import { createStitches } from 'stitches-native';

export const {
  css,
  styled,
  createTheme: createPlayerTheme,
  theme: defaultTheme,
  ThemeProvider,
} = createStitches({
  media: {
    sm: '(width < 640px)',
    md: '(width >= 640px)',
    lg: '(width >= 1024px)',
  },
  theme: {
    borderStyles: {
      containerBorderStyle: 'hidden',
    },
    borderWidths: {
      containerBorderWidth: 0,
      loadingWidth: 3,
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
    // shadows: {
    //   containerShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
    //   containerShadowHover: '$containerShadow',
    // },
    sizes: {
      iconButtonSize: 42,
      iconButtonSizeSm: 36,
      liveIndicatorSize: 5,
      loading: 64,
      thumb: 12,
      trackActive: 5,
      trackContainerHeight: 15,
      trackContainerHeightSm: 20,
      trackInactive: 3,
    },
    space: {
      controlsBottomMarginX: 10,
      controlsBottomMarginY: 5,
      controlsTopMarginX: 15,
      controlsTopMarginY: 10,
      timeMarginX: 8,
    },
    radii: {
      containerBorderRadius: 5,
      slider: 3,
    },
  },
});

export type ThemeConfig = Parameters<typeof createPlayerTheme>[0];
