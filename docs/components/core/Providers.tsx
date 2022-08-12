// import { LivepeerConfig } from '@livepeer/react';
// import { studioProvider } from 'livepeer/providers/studio';
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

import { alchemyProvider } from 'wagmi/providers/alchemy';

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
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
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
