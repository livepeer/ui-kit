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
    containerBorderStyle?: 'solid' | 'dotted' | 'dashed' | undefined;
  };
  borderWidths: {
    containerBorderWidth?: string | number | undefined;
    loadingWidth?: string | number | undefined;
  };
  colors: {
    accent?: string | undefined;
    background?: string | undefined;
    containerBorderColor?: string | undefined;

    icon?: string | undefined;
    iconHover?: string | undefined;

    liveIndicator?: string | undefined;

    loading?: string | undefined;

    progressLeft?: string | undefined;
    progressMiddle?: string | undefined;
    progressRight?: string | undefined;
    progressThumb?: string | undefined;

    volumeLeft?: string | undefined;
    volumeMiddle?: string | undefined;
    volumeRight?: string | undefined;
    volumeThumb?: string | undefined;
  };
  fonts: {
    display?: string | undefined;
  };
  fontSizes: {
    timeFontSize?: string | number | undefined;
    timeFontSizeMd?: string | number | undefined;
    timeFontSizeSm?: string | number | undefined;

    titleFontSize?: string | number | undefined;
    titleFontSizeMd?: string | number | undefined;
    titleFontSizeSm?: string | number | undefined;
  };
  fontWeights: {
    titleFontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | undefined;
  };
  sizes: {
    iconButtonSize?: string | number | undefined;
    iconButtonSizeSm?: string | number | undefined;

    liveIndicatorSize?: string | number | undefined;
    loading?: string | number | undefined;

    thumb?: string | number | undefined;
    thumbActive?: string | number | undefined;

    trackActive?: string | number | undefined;
    trackContainerHeight?: string | number | undefined;
    trackContainerHeightSm?: string | number | undefined;
    trackInactive?: string | number | undefined;
  };
  space: {
    controlsBottomMarginX?: string | number | undefined;
    controlsBottomMarginY?: string | number | undefined;
    controlsTopMarginX?: string | number | undefined;
    controlsTopMarginY?: string | number | undefined;

    timeMarginX?: string | number | undefined;
  };
  radii: {
    containerBorderRadius?: string | number | undefined;
    slider?: string | number | undefined;
  };
}>;
