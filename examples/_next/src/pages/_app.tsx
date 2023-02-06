import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

const livepeerClient = createReactClient({
  provider: studioProvider({
    baseUrl: 'https://livepeer.monster/api',
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? '',
  }),
});

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY ?? '' }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'livepeer.js dev',
  chains,
});

const wagmiClient = createClient({
  connectors,
  provider,
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

      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <LivepeerConfig
            dehydratedState={pageProps?.dehydratedState}
            client={livepeerClient}
          >
            <Component {...pageProps} />
          </LivepeerConfig>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
};

export default App;
