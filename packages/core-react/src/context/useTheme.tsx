import { ThemeConfig } from '@livepeer/core/media';
import { deepMerge } from '@livepeer/core/utils';
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

    // override tokens based on priority
    const overriddenTheme: typeof mergedTheme = mergedTheme
      ? deepMerge(
          {
            colors: {
              progressLeft:
                mergedTheme.colors?.progressLeft ?? mergedTheme.colors?.accent,
              progressMiddle:
                mergedTheme.colors?.progressMiddle ??
                mergedTheme.colors?.accent,
              progressRight:
                mergedTheme.colors?.progressRight ?? mergedTheme.colors?.accent,

              volumeLeft:
                mergedTheme.colors?.volumeLeft ?? mergedTheme.colors?.accent,
              volumeMiddle:
                mergedTheme.colors?.volumeMiddle ?? mergedTheme.colors?.accent,
              volumeRight:
                mergedTheme.colors?.volumeRight ?? mergedTheme.colors?.accent,

              progressThumb:
                mergedTheme.colors?.progressThumb ?? mergedTheme.colors?.icon,
              volumeThumb:
                mergedTheme.colors?.volumeThumb ?? mergedTheme.colors?.icon,
            },
          },
          mergedTheme,
        )
      : undefined;

    const filteredTheme = overriddenTheme
      ? removeNullish(overriddenTheme)
      : undefined;

    return filteredTheme ? createTheme(filteredTheme) : undefined;
  }, [theme, contextTheme, createTheme]);

  return containerTheme;
};

function removeNullish<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeNullish(v) : v]),
  ) as T;
}
