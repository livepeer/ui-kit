import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import {
  Persister,
  persistQueryClient,
} from '@tanstack/react-query-persist-client';
import {
  ClientConfig,
  Client as CoreClient,
  LivepeerProvider,
  createClient,
} from 'livepeer';

import { deserialize, serialize } from './utils';

export type ReactClient<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = CoreClient<TLivepeerProvider> & {
  queryClient: QueryClient;
};

export type CreateReactClientConfig<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = ClientConfig<TLivepeerProvider> & {
  queryClient?: QueryClient;
  persister?: Persister | null;
};
export function createReactClient<TLivepeerProvider extends LivepeerProvider>({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1_000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  }),
  ...config
}: CreateReactClientConfig<TLivepeerProvider>): ReactClient<TLivepeerProvider> {
  const client = createClient<TLivepeerProvider>(config);
  const persister =
    typeof window !== 'undefined'
      ? createSyncStoragePersister({
          key: 'livepeer.cache',
          storage: config?.storage ?? window.localStorage,
          serialize,
          deserialize,
        })
      : undefined;
  if (persister)
    persistQueryClient({
      queryClient,
      persister,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => query.cacheTime !== 0,
      },
    });
  return Object.assign(client, { queryClient });
}

export type Client<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = CoreClient<TLivepeerProvider> & { queryClient: QueryClient };
