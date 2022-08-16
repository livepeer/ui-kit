import { getClient } from '../../client';
import { LPMSProvider } from '../../types';

export type GetLPMSProviderResult<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
> = TLPMSProvider;

export function getLPMSProvider<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>(): GetLPMSProviderResult<TLPMSProvider> {
  const client = getClient<TLPMSProvider>();

  return client.provider;
}
