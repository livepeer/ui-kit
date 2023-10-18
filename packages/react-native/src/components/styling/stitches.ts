import { ThemeConfig } from '@livepeer/core-react';
import { createStitches } from 'stitches-native';

const accent = '#00a55f';
const muted = '#B7B7B7';
const icon = 'rgba(255,255,255,1)';

const theme: Required<{
  [key in keyof ThemeConfig]: Required<ThemeConfig[key]>;
}> = {
  borderStyles: {
    containerBorderStyle: 'solid',
  },
  borderWidths: {
    buttonLoadingWidth: 1,
    containerBorderWidth: 0,
    loadingWidth: 3,
  },
  colors: {
    accent,
    background: '#000000',
    containerBorderColor: 'transparent',
    icon,
    iconHover: 'rgba(255,255,255,0.8)',
    liveIndicator: '#e5484d',
    loading: accent,
    progressLeft: accent,
    progressMiddle: accent,
    progressRight: accent,
    progressThumb: icon,
    volumeLeft: accent,
    volumeMiddle: accent,
    volumeRight: accent,
    volumeThumb: icon,
    errorText: muted,
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
    errorTitleFontSize: 28,
    errorTitleFontSizeMd: 22,
    errorTitleFontSizeSm: 18,
    errorTextFontSize: 14,
    errorTextFontSizeMd: 12,
    errorTextFontSizeSm: 10,
  },
  fontWeights: {
    titleFontWeight: '400',
    errorTitleFontWeight: '700',
  },
  sizes: {
    iconButtonSize: 42,
    iconButtonSizeSm: 36,
    liveIndicatorSize: 5,
    loading: 64,
    thumb: 12,
    thumbActive: 14,
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
    containerBorderRadius: 0,
    slider: 3,
  },
};

export const {
  styled,
  createTheme,
  theme: defaultTheme,
  useTheme,
  ThemeProvider: StitchesThemeProvider,
} = createStitches({
  media: {
    sm: '(width < 640px)',
    md: '(width >= 640px)',
    lg: '(width >= 1024px)',
  },
  theme,
});
