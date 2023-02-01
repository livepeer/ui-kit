import { ThemeConfig } from '@livepeer/core-react';
import { useTheme as useThemeCore } from '@livepeer/core-react/context';

import { ThemeContext } from './ThemeContext';
import { createTheme } from '../components/styling';

export const useTheme = (theme?: ThemeConfig) => {
  return useThemeCore(ThemeContext, createTheme, theme);
};
