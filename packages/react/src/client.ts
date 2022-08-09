import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import {
  Persister,
  persistQueryClient,
} from '@tanstack/react-query-persist-client';
import {
  ClientConfig,
  Client as CoreClient,
  DmsProvider,
  createClient as createCoreClient,
} from 'livepeer';

import { deserialize, serialize } from './utils';

export type CreateClientConfig<TDmsProvider extends DmsProvider = DmsProvider> =
  ClientConfig<TDmsProvider> & {
    queryClient?: QueryClient;
    persister?: Persister | null;
  };
export function createClient<TDmsProvider extends DmsProvider>({
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
  persister = typeof window !== 'undefined'
    ? createSyncStoragePersister({
        key: 'livepeer.cache',
        storage: window.localStorage,
        serialize,
        deserialize,
      })
    : undefined,
  ...config
}: CreateClientConfig<TDmsProvider>) {
  const client = createCoreClient<TDmsProvider>(config);
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

export type Client<TDmsProvider extends DmsProvider = DmsProvider> =
  CoreClient<TDmsProvider> & { queryClient: QueryClient };
