import { DesignSystemProvider, getThemes } from '@livepeer/design-system';
import type { AppProps } from 'next/app';

import * as React from 'react';

import '../styles/globals.css';

import { Providers } from '../components/core';

const themes: any = getThemes();
const themeMap: any = {};
Object.keys(themes).map(
  (key, _index) => (themeMap[themes[key].className] = themes[key].className),
);

function App({ Component, pageProps }: AppProps) {
  // const savedTheme =
  //   typeof window !== 'undefined'
  //     ? (localStorage.getItem(themeKey) as any)
  //     : undefined;
  // const defaultMode = ['dark', 'light'].includes(savedTheme)
  //   ? savedTheme
  //   : 'dark';

  // const themeScriptSrc = `!function(){try{var d=document.documentElement;var e=localStorage.getItem(${themeKey});if(e){d.setAttribute('data-theme',e.trim())}else{d.setAttribute('data-theme','light');}}catch(t){}}();`;

  // We MUST use next/script's `beforeInteractive` strategy to avoid flashing on load.
  // However, it only accepts the `src` prop, not `dangerouslySetInnerHTML` or `children`
  // But our script cannot be external because it changes at runtime based on React props
  // so we trick next/script by passing `src` as a base64 JS script
  // const encodedScript = `data:text/javascript;base64,${encodeBase64(
  //   themeScriptSrc,
  // )}`;

  const getLayout =
    (Component as any).getLayout || ((page: React.ReactElement) => page);

  return (
    <>
      {/* Set theme directly or load from cookie to prevent flash */}
      {/* <NextScript
        id="theme-script"
        src={encodedScript}
        strategy="beforeInteractive"
      /> */}

      <Providers>
        <DesignSystemProvider>
          {getLayout(<Component {...pageProps} />)}
        </DesignSystemProvider>
      </Providers>
    </>
  );
}

export default App;
