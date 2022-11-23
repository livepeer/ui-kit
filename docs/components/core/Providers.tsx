import { Box, getThemes } from '@livepeer/design-system';
import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
} from '@livepeer/react';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AptosClient } from 'aptos';
import { useRouter } from 'next/router';
import { useTheme } from 'nextra-theme-docs';
import { ReactNode, createContext, useEffect, useMemo, useState } from 'react';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';

import { infuraProvider } from 'wagmi/providers/infura';

import { publicProvider } from 'wagmi/providers/public';

import { provider as livepeerProvider } from '../../lib/provider';
import { SyncedTabsContext, SyncedTabsState } from './SyncedTabs';

import '@rainbow-me/rainbowkit/styles.css';

export const AptosContext = createContext<AptosClient | null>(null);

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'livepeer.js docs',
  chains,
});

const wagmiClient = createClient({
  connectors,
  provider,
});

const livepeerClient = createReactClient({
  provider: livepeerProvider,
});

type Props = {
  children?: ReactNode;
  dehydratedState?: string;
};

const livepeerLightTheme: ThemeConfig = {
  borderWidths: {
    loadingWidth: '2px',
  },
  colors: {
    accent: 'rgb(0, 145, 255)',
  },
  fonts: {
    display: 'Inter',
  },
  fontWeights: {
    titleFontWeight: '800',
  },
  sizes: {
    loading: '80px',
    trackActive: '6px',
    trackInactive: '3px',
  },
  radii: {
    slider: '4px',
  },
};

const livepeerDarkTheme: ThemeConfig = {
  borderStyles: {
    ...livepeerLightTheme.borderStyles,
  },
  borderWidths: {
    ...livepeerLightTheme.borderWidths,
  },
  colors: {
    ...livepeerLightTheme.colors,
    containerBorderColor: 'rgba(0, 145, 255, 0.5)',
  },
  fonts: {
    ...livepeerLightTheme.fonts,
  },
  fontWeights: {
    ...livepeerLightTheme.fontWeights,
  },
  sizes: {
    ...livepeerLightTheme.sizes,
  },
  radii: {
    ...livepeerLightTheme.radii,
  },
};

const themes: any = getThemes();

const queryClient = new QueryClient();

export function Providers({ children, dehydratedState }: Props) {
  const { theme } = useTheme();
  const router = useRouter();

  const livepeerTheme = useMemo(
    () => (theme === 'light' ? livepeerLightTheme : livepeerDarkTheme),
    [theme],
  );

  const [syncedTabsStore, setSyncedTabsStore] = useState<
    SyncedTabsState['store']
  >({});

  useEffect(() => {
    if (Object.keys(router.query).length > 0) {
      setSyncedTabsStore(
        Object.keys(router?.query)?.reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: Number(router?.query?.[curr] ?? 0),
          }),
          {},
        ),
      );
    }
  }, [router.query]);

  const syncedTabsState: SyncedTabsState = useMemo(
    () => ({
      store: syncedTabsStore,
      setNewIndex: (key, index) => {
        router.push(
          {
            pathname: router.pathname,
            query: {
              ...(router.query ? router.query : {}),
              [key]: index,
            },
          },
          undefined,
          { scroll: false },
        );
      },
    }),
    [router, syncedTabsStore],
  );

  const aptosClient = useMemo(
    () => new AptosClient('https://fullnode.devnet.aptoslabs.com/v1'),
    [],
  );

  return (
    // Add styling for livepeer-design-system components
    <Box
      className={themes[`${theme === 'light' ? 'light' : 'dark'}-theme-blue`]}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <AptosContext.Provider value={aptosClient}>
              <LivepeerConfig
                dehydratedState={dehydratedState}
                client={livepeerClient}
                theme={livepeerTheme}
              >
                <SyncedTabsContext.Provider value={syncedTabsState}>
                  {children}
                </SyncedTabsContext.Provider>
              </LivepeerConfig>
            </AptosContext.Provider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </Box>
  );
}
