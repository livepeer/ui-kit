import { LivepeerConfig, createReactClient } from '@livepeer/react';
import { studioProvider } from 'livepeer/providers/studio';
import * as React from 'react';

import {
  WagmiConfig,
  configureChains,
  createClient,
  defaultChains,
} from 'wagmi';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { infuraProvider } from 'wagmi/providers/infura';

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
]);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'livepeer',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

type Props = {
  children?: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <WagmiConfig client={client}>
      <LivepeerConfig client={livepeerClient}>{children}</LivepeerConfig>
    </WagmiConfig>
  );
}
