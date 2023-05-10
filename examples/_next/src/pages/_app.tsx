import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import '@rainbow-me/rainbowkit/styles.css';

import type { AppProps } from 'next/app';
import NextHead from 'next/head';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
    baseUrl: 'https://livepeer.monster/api',
  }),
});

const App = ({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: string }>) => {
  return (
    <>
      <NextHead>
        <title>dev example - livepeer.js</title>
      </NextHead>

      <LivepeerConfig
        dehydratedState={pageProps?.dehydratedState}
        client={livepeerClient}
      >
        <Component {...pageProps} />
      </LivepeerConfig>
    </>
  );
};

export default App;
