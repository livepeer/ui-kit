import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { useMemo } from 'react';

const App = ({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: string }>) => {
  const livepeerClient = useMemo(() => {
    return createReactClient({
      provider: studioProvider({
        apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
      }),
    });
  }, []);

  return (
    <>
      <NextHead>
        <title>nextjs example - livepeer.js</title>
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
