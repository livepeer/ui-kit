import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LivepeerProvider } from 'livepeer';
import * as React from 'react';

import { Client } from './client';

export const Context = React.createContext<
  Client<LivepeerProvider> | undefined
>(undefined);

// we create a custom query context so that all queries can use this and not share context with other react-query
export const QueryClientContext = React.createContext<QueryClient | undefined>(
  undefined,
);

export type LivepeerConfigProps<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = {
  /** React-decorated Client instance */
  client: Client<TLivepeerProvider>;
};
export function LivepeerConfig<TLivepeerProvider extends LivepeerProvider>({
  children,
  client,
}: React.PropsWithChildren<LivepeerConfigProps<TLivepeerProvider>>) {
  return (
    <Context.Provider value={client as unknown as Client}>
      <QueryClientProvider
        context={QueryClientContext}
        client={client.queryClient}
      >
        {children}
      </QueryClientProvider>
    </Context.Provider>
  );
}

export function useClient<TLivepeerProvider extends LivepeerProvider>() {
  const client = React.useContext(Context) as Client<TLivepeerProvider>;
  if (!client)
    throw new Error(
      ['`useClient` must be used within `LivepeerConfig`.'].join('\n'),
    );
  return client;
}
