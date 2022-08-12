import { LivepeerConfig, createReactClient } from '@livepeer/react';
import { studioProvider } from 'livepeer/providers/studio';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';

import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

const { provider, webSocketProvider } = configureChains(
  [chain.arbitrum],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
    publicProvider(),
  ],
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
