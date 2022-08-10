import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider } = configureChains(
  [chain.arbitrum],
  [publicProvider()],
);

const client = createClient({
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

      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  );
};

export default App;
