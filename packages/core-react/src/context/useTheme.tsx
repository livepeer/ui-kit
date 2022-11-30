import { ThemeConfig } from 'livepeer/media';
import { deepMerge } from 'livepeer/utils';
import * as React from 'react';

export const useTheme = (
  ThemeContext: React.Context<Partial<ThemeConfig> | null>,
  createTheme: {
    (arg: ThemeConfig): ThemeConfig;
  },
  theme?: ThemeConfig,
) => {
  const contextTheme = React.useContext(ThemeContext);

  const containerTheme = React.useMemo(() => {
    const mergedTheme = contextTheme
      ? theme
        ? deepMerge(contextTheme, theme)
        : deepMerge(contextTheme)
      : theme;

    return mergedTheme ? createTheme(mergedTheme) : undefined;
  }, [theme, contextTheme, createTheme]);

  return containerTheme;
};
