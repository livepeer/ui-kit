import { ThemeConfig, createPlayerTheme, deepMerge } from 'livepeer';
import * as React from 'react';

import { ThemeContext } from './ThemeContext';

export const useTheme = (theme?: ThemeConfig) => {
  const contextTheme = React.useContext(ThemeContext);

  const containerTheme = React.useMemo(() => {
    const mergedTheme = contextTheme
      ? theme
        ? (deepMerge(contextTheme as object, theme as object) as ThemeConfig)
        : contextTheme
      : theme;

    return mergedTheme ? createPlayerTheme(mergedTheme) : undefined;
  }, [theme, contextTheme]);

  return containerTheme;
};
