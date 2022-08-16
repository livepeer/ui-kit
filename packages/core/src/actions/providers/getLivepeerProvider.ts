import { getClient } from '../../client';
import { LivepeerProvider } from '../../types';

export type GetLivepeerProviderResult<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = TLivepeerProvider;

export function getLivepeerProvider<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(): GetLivepeerProviderResult<TLivepeerProvider> {
  const client = getClient<TLivepeerProvider>();

  return client.provider;
}
