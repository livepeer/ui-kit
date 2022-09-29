import { ThemeConfig } from 'livepeer';
import * as React from 'react';

import { ThemeContext } from './ThemeContext';

export type ThemeProviderProps = {
  theme?: ThemeConfig;
  children: React.ReactNode;
};

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  return (
    <ThemeContext.Provider value={theme ?? null}>
      {children}
    </ThemeContext.Provider>
  );
};
