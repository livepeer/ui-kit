import {
  LivepeerConfig,
  ThemeConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { useTheme } from 'next-themes';

import { ReactNode, useMemo, useState } from 'react';

import { WagmiConfig, chain, createClient } from 'wagmi';

import { SyncedTabsContext, SyncedTabsState } from './SyncedTabs';

const wagmiClient = createClient(
  getDefaultClient({
    appName: 'livepeer.js',
    chains: [chain.polygonMumbai],
    infuraId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  }),
);

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  }),
});

type Props = {
  children?: ReactNode;
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
    titleFontWeight: 800,
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

export function Providers({ children }: Props) {
  const { theme } = useTheme();

  const livepeerTheme = useMemo(
    () => (theme === 'light' ? livepeerLightTheme : livepeerDarkTheme),
    [theme],
  );

  const [syncedTabsStore, setSyncedTabsStore] = useState<
    SyncedTabsState['store']
  >({});

  const syncedTabsState: SyncedTabsState = useMemo(
    () => ({
      store: syncedTabsStore,
      setNewIndex: (key, index) =>
        setSyncedTabsStore((prev) => ({ ...prev, [key]: index })),
    }),
    [syncedTabsStore, setSyncedTabsStore],
  );

  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider>
        <LivepeerConfig client={livepeerClient} theme={livepeerTheme}>
          <SyncedTabsContext.Provider value={syncedTabsState}>
            {children}
          </SyncedTabsContext.Provider>
        </LivepeerConfig>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
