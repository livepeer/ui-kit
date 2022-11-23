import { ThemeConfig } from 'livepeer/media';
import { createStitches } from 'stitches-native';

const theme: ThemeConfig = {
  borderStyles: {
    containerBorderStyle: 'solid',
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
    timeFontSize: 16,
    timeFontSizeMd: 14,
    timeFontSizeSm: 12,
    titleFontSize: 16,
    titleFontSizeMd: 14,
    titleFontSizeSm: 12,
  },
  fontWeights: {
    titleFontWeight: '400',
  },
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
};

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
  theme,
});
