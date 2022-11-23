import { ThemeConfig } from 'livepeer/media';
import { deepMerge } from 'livepeer/utils';
import * as React from 'react';

import { createPlayerTheme } from '../components/styling';

import { ThemeContext } from './ThemeContext';

export const useTheme = (theme?: ThemeConfig) => {
  const contextTheme = React.useContext(ThemeContext);

  const containerTheme = React.useMemo(() => {
    const mergedTheme = contextTheme
      ? theme
        ? (deepMerge(contextTheme as object, theme as object) as ThemeConfig)
        : contextTheme
      : theme;

    return mergedTheme
      ? (createPlayerTheme(mergedTheme) as ThemeConfig)
      : undefined;
  }, [theme, contextTheme]);

  return containerTheme;
};
