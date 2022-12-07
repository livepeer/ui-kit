import {
  ClientConfig,
  Client as CoreClient,
  createClient,
} from '@livepeer/core/client';
import { LivepeerProvider } from '@livepeer/core/types';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

import { deserialize } from './utils/deserialize';
import { serialize } from './utils/serialize';

export const defaultQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        networkMode: 'offlineFirst',
        refetchOnWindowFocus: false,
        retry: 0,
      },
      mutations: {
        networkMode: 'offlineFirst',
      },
    },
  });

export type ReactClient<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = CoreClient<TLivepeerProvider> & {
  queryClient: QueryClient;
};

export type CreateReactClientConfig<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = ClientConfig<TLivepeerProvider> & {
  queryClient?: QueryClient;
};
export function createReactClient<TLivepeerProvider extends LivepeerProvider>({
  queryClient = defaultQueryClient(),
  ...config
}: CreateReactClientConfig<TLivepeerProvider>): ReactClient<TLivepeerProvider> {
  const client = createClient<TLivepeerProvider>(config);
  const persister = config?.storage
    ? createAsyncStoragePersister({
        key: 'livepeer.cache',
        storage: config?.storage,
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
