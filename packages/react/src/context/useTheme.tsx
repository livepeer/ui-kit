import { useTheme as useThemeCore } from '@livepeer/core-react/context';
import { ThemeConfig } from '@livepeer/core-web/media';
import { createTheme } from '@livepeer/core-web/media/browser/styling';

import { ThemeContext } from './ThemeContext';

export const useTheme = (theme?: ThemeConfig) => {
  return useThemeCore(ThemeContext, createTheme, theme);
};
