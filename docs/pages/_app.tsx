import { DesignSystemProvider, getThemes } from '@livepeer/design-system';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import * as React from 'react';

import { Providers } from '../components/core';

import '../styles/globals.css';

const themes: any = getThemes();
const themeMap: any = {};
Object.keys(themes).map(
  (key, _index) => (themeMap[themes[key].className] = themes[key].className),
);

function App({ Component, pageProps }: AppProps<{ dehydratedState: string }>) {
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
          {getLayout(<Component {...pageProps} />)}
        </Providers>
      </ThemeProvider>
    </DesignSystemProvider>
  );
}

export default App;
