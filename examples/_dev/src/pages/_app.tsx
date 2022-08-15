import { LivepeerConfig, createReactClient } from '@livepeer/react';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { studioProvider } from 'livepeer/providers/studio';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { WagmiConfig, createClient } from 'wagmi';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

const wagmiClient = createClient(
  getDefaultClient({
    appName: 'livepeer.js dev',

    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  }),
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>livepeer.js</title>
      </NextHead>

      <WagmiConfig client={wagmiClient}>
        <ConnectKitProvider>
          <LivepeerConfig client={livepeerClient}>
            <Component {...pageProps} />
          </LivepeerConfig>
        </ConnectKitProvider>
      </WagmiConfig>
    </>
  );
};

export default App;
