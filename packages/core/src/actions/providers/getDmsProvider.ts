import { getClient } from '../../client';
import { DmsProvider } from '../../types';

export type GetDmsProviderResult<
  TDmsProvider extends DmsProvider = DmsProvider,
> = TDmsProvider;

export function getDmsProvider<
  TDmsProvider extends DmsProvider = DmsProvider,
>(): GetDmsProviderResult<TDmsProvider> {
  const client = getClient<TDmsProvider>();
  if (typeof client.config.provider === 'function')
    return client.config.provider();
  return client.provider;
}
