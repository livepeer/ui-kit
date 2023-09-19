import { Client } from '@livepeer/core-react/client';
import {
  Context as CoreContext,
  LivepeerConfig as CoreLivepeerConfig,
  LivepeerConfigProps as CoreLivepeerConfigProps,
  QueryClientContext as CoreQueryClientContext,
  useClient as useClientCore,
} from '@livepeer/core-react/context';
import { QueryClient } from '@tanstack/react-query';
import { ThemeConfig } from 'livepeer/media';

import { LivepeerProvider } from 'livepeer/types';
import * as React from 'react';

import { ThemeProvider } from './ThemeProvider';

export const Context: React.Context<Client<LivepeerProvider> | undefined> =
  CoreContext;
export const QueryClientContext: React.Context<QueryClient | undefined> =
  CoreQueryClientContext;

// export const Context = CoreContext;
// export const QueryClientContext = CoreQueryClientContext;
export const useClient = useClientCore;

// Extends the core livepeer config to provide theming
export type LivepeerConfigProps<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = CoreLivepeerConfigProps<TLivepeerProvider> & {
  /** Theme used for React components */
  theme?: ThemeConfig;
};

export function LivepeerConfig<TLivepeerProvider extends LivepeerProvider>({
  children,
  client,
  theme,
  dehydratedState,
}: React.PropsWithChildren<LivepeerConfigProps<TLivepeerProvider>>) {
  return (
    <CoreLivepeerConfig client={client} dehydratedState={dehydratedState}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CoreLivepeerConfig>
  );
}
