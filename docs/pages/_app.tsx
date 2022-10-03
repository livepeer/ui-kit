import { Box, DesignSystemProvider, getThemes } from '@livepeer/design-system';
import { ThemeProvider, useTheme } from 'next-themes';
import type { AppProps } from 'next/app';

import * as React from 'react';

import { Providers } from '../components/core';

import '../styles/globals.css';

const themes: any = getThemes();
const themeMap: any = {};
Object.keys(themes).map(
  (key, _index) => (themeMap[themes[key].className] = themes[key].className),
);

function App({ Component, pageProps }: AppProps) {
  const { theme } = useTheme();
  const getLayout =
    (Component as any).getLayout || ((page: React.ReactElement) => page);

  return (
    <DesignSystemProvider>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        value={{
          ...themeMap,
          dark: 'dark',
          light: 'light',
        }}
      >
        <Providers dehydratedState={pageProps?.dehydratedState}>
          {/* Add styling for livepeer-design-system components */}
          <Box
            className={
              themes[`${theme === 'light' ? 'light' : 'dark'}-theme-blue`]
            }
          >
            {getLayout(<Component {...pageProps} />)}
          </Box>
        </Providers>
      </ThemeProvider>
    </DesignSystemProvider>
  );
}

export default App;
