import { QueryClientProvider } from '@tanstack/react-query';
import { DmsProvider } from 'livepeer';
import * as React from 'react';

import { Client } from './client';

export const Context = React.createContext<Client<DmsProvider> | undefined>(
  undefined,
);

export type LivepeerConfigProps<
  TDmsProvider extends DmsProvider = DmsProvider,
> = {
  /** React-decorated Client instance */
  client: Client<TDmsProvider>;
};
export function LivepeerConfig<TDmsProvider extends DmsProvider>({
  children,
  client,
}: React.PropsWithChildren<LivepeerConfigProps<TDmsProvider>>) {
  return (
    <Context.Provider value={client as unknown as Client}>
      <QueryClientProvider client={client.queryClient}>
        {children}
      </QueryClientProvider>
    </Context.Provider>
  );
}

export function useClient<TDmsProvider extends DmsProvider>() {
  const client = React.useContext(Context) as Client<TDmsProvider>;
  if (!client)
    throw new Error(
      ['`useClient` must be used within `LivepeerConfig`.'].join('\n'),
    );
  return client;
}
