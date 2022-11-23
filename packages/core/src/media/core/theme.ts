export const aspectRatios = [
  { key: '16to9', value: '16 / 9', numeric: 16 / 9 },
  { key: '1to1', value: '1 / 1', numeric: 1 / 1 },
  { key: '9to16', value: '9 / 16', numeric: 9 / 16 },
  { key: '4to5', value: '4 / 5', numeric: 4 / 5 },
  { key: '21to9', value: '21 / 9', numeric: 21 / 9 },
] as const;

export type AspectRatio = typeof aspectRatios[number]['key'];

export type ThemeConfig = Partial<{
  borderStyles: {
    containerBorderStyle?: string | number | boolean | undefined;
  };
  borderWidths: {
    containerBorderWidth?: string | number | boolean | undefined;
    loadingWidth?: string | number | boolean | undefined;
  };
  colors: {
    accent?: string | number | boolean | undefined;
    background?: string | number | boolean | undefined;
    containerBorderColor?: string | number | boolean | undefined;
    icon?: string | number | boolean | undefined;
    iconHover?: string | number | boolean | undefined;
    liveIndicator?: string | number | boolean | undefined;
  };
  fonts: {
    display?: string | number | boolean | undefined;
  };
  fontSizes: {
    timeFontSize?: string | number | boolean | undefined;
    timeFontSizeMd?: string | number | boolean | undefined;
    timeFontSizeSm?: string | number | boolean | undefined;
    titleFontSize?: string | number | boolean | undefined;
    titleFontSizeMd?: string | number | boolean | undefined;
    titleFontSizeSm?: string | number | boolean | undefined;
  };
  fontWeights: {
    titleFontWeight?: string | number | boolean | undefined;
  };
  sizes: {
    iconButtonSize?: string | number | boolean | undefined;
    iconButtonSizeSm?: string | number | boolean | undefined;
    liveIndicatorSize?: string | number | boolean | undefined;
    loading?: string | number | boolean | undefined;
    thumb?: string | number | boolean | undefined;
    thumbActive?: string | number | boolean | undefined;
    trackActive?: string | number | boolean | undefined;
    trackContainerHeight?: string | number | boolean | undefined;
    trackContainerHeightSm?: string | number | boolean | undefined;
    trackInactive?: string | number | boolean | undefined;
  };
  space: {
    controlsBottomMarginX?: string | number | boolean | undefined;
    controlsBottomMarginY?: string | number | boolean | undefined;
    controlsTopMarginX?: string | number | boolean | undefined;
    controlsTopMarginY?: string | number | boolean | undefined;
    timeMarginX?: string | number | boolean | undefined;
  };
  radii: {
    containerBorderRadius?: string | number | boolean | undefined;
    slider?: string | number | boolean | undefined;
  };
}>;
