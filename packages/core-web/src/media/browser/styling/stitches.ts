import { ThemeConfig } from '@livepeer/core/media';
import { createStitches } from '@stitches/core';

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
    containerBorderWidth: 0,
    loadingWidth: '3px',
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
    timeFontSize: '1.0rem',
    timeFontSizeMd: '0.95rem',
    timeFontSizeSm: '0.85rem',
    titleFontSize: '1.1rem',
    titleFontSizeMd: '1rem',
    titleFontSizeSm: '0.9rem',
    errorTitleFontSize: '2.5rem',
    errorTextFontSize: '0.95rem',
  },
  fontWeights: {
    titleFontWeight: '400',
    errorTitleFontWeight: '700',
  },
  sizes: {
    iconButtonSize: '42px',
    iconButtonSizeSm: '36px',
    liveIndicatorSize: '5px',
    loading: '64px',
    thumb: '10px',
    thumbActive: '12px',
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
    containerBorderRadius: '0px',
    slider: '3px',
  },
};

export const {
  css,
  createTheme,
  theme: defaultTheme,
  getCssText,
} = createStitches({
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
  },
  theme,
});
