import { LivepeerConfig, createReactClient } from '@livepeer/react';
import { studioProvider } from 'livepeer/providers/studio';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';

const livepeerClient = createReactClient({
  providers: [studioProvider()],
});

const { provider, webSocketProvider } = configureChains(
  [chain.arbitrum],
  [publicProvider()],
);

const wagmiClient = createClient({
  autoConnect: true,
  persister: null,
  provider,
  webSocketProvider,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>livepeer.js</title>
      </NextHead>

      <WagmiConfig client={wagmiClient}>
        <LivepeerConfig client={livepeerClient}>
          <Component {...pageProps} />
        </LivepeerConfig>
      </WagmiConfig>
    </>
  );
};

export default App;
