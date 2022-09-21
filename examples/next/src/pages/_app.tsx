import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

const { provider, webSocketProvider } = configureChains(
  [chain.arbitrum],
  [infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY })],
);

const wagmiClient = createClient({
  provider,
  webSocketProvider,
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NextHead>
        <title>nextjs example - livepeer.js</title>
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
