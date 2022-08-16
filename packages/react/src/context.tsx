import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { LPMSProvider } from 'livepeer';
import * as React from 'react';

import { Client } from './client';

export const Context = React.createContext<Client<LPMSProvider> | undefined>(
  undefined,
);

// we create a custom query context so that all queries can use this and not share context with other react-query
export const QueryClientContext = React.createContext<QueryClient | undefined>(
  undefined,
);

export type LivepeerConfigProps<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
> = {
  /** React-decorated Client instance */
  client: Client<TLPMSProvider>;
};
export function LivepeerConfig<TLPMSProvider extends LPMSProvider>({
  children,
  client,
}: React.PropsWithChildren<LivepeerConfigProps<TLPMSProvider>>) {
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

export function useClient<TLPMSProvider extends LPMSProvider>() {
  const client = React.useContext(Context) as Client<TLPMSProvider>;
  if (!client)
    throw new Error(
      ['`useClient` must be used within `LivepeerConfig`.'].join('\n'),
    );
  return client;
}
