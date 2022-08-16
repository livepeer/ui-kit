import { getClient } from '../../client';
import { LivepeerProvider } from '../../types';

import {
  GetLivepeerProviderResult,
  getLivepeerProvider,
} from './getLivepeerProvider';

export type WatchLivepeerProviderCallback<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = (provider: GetLivepeerProviderResult<TLivepeerProvider>) => void;

export function watchLivepeerProvider<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(callback: WatchLivepeerProviderCallback<TLivepeerProvider>) {
  const client = getClient();
  const handleChange = async () =>
    callback(getLivepeerProvider<TLivepeerProvider>());
  const unsubscribe = client.subscribe(
    ({ provider }) => provider,
    handleChange,
  );
  return unsubscribe;
}
