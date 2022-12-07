import { LivepeerProvider } from '@livepeer/core/types';
import {
  Hydrate,
  HydrateOptions,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import * as React from 'react';

import { Client, ReactClient } from '../client';

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
  client: ReactClient<TLivepeerProvider>;
  /**
   * Dehydrated state passed from a server after SSR.
   *
   * @see {@link https://tanstack.com/query/v4/docs/guides/ssr}
   */
  dehydratedState?: string;
};

export function LivepeerConfig<TLivepeerProvider extends LivepeerProvider>({
  children,
  client,
  dehydratedState,
}: React.PropsWithChildren<LivepeerConfigProps<TLivepeerProvider>>) {
  return (
    <Context.Provider value={client as unknown as Client}>
      <QueryClientProvider
        context={QueryClientContext}
        client={client.queryClient}
      >
        <Hydrate
          options={{ context: QueryClientContext } as HydrateOptions}
          state={dehydratedState ?? undefined}
        >
          {children}
        </Hydrate>
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
