import { LivepeerProvider, createStorage } from '@livepeer/core-react';
import {
  Client,
  CreateReactClientConfig,
  ReactClient,
  createReactClient as createCoreReactClient,
  defaultQueryClient,
} from '@livepeer/core-react/client';

export function createReactClient<TLivepeerProvider extends LivepeerProvider>({
  ...config
}: CreateReactClientConfig<TLivepeerProvider>): ReactClient<TLivepeerProvider> {
  return createCoreReactClient({
    storage: config.storage
      ? createStorage({
          storage: config.storage,
        })
      : undefined,
    ...config,
  });
}

export {
  type Client,
  type CreateReactClientConfig,
  type ReactClient,
  defaultQueryClient,
};
