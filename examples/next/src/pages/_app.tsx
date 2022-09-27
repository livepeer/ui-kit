import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>nextjs example - livepeer.js</title>
      </NextHead>

      <LivepeerConfig client={livepeerClient}>
        <Component {...pageProps} />
      </LivepeerConfig>
    </>
  );
};

export default App;
