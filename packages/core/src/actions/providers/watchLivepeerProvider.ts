import {
  GetLivepeerProviderResult,
  getLivepeerProvider,
} from './getLivepeerProvider';
import { getClient } from '../../client';
import { LivepeerProvider } from '../../types';

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
