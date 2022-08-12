import { getClient } from '../../client';
import { LPMSProvider } from '../../types';

import { GetLPMSProviderResult, getLPMSProvider } from './getLPMSProvider';

export type WatchLPMSProviderCallback<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
> = (provider: GetLPMSProviderResult<TLPMSProvider>) => void;

export function watchLPMSProvider<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>(callback: WatchLPMSProviderCallback<TLPMSProvider>) {
  const client = getClient();
  const handleChange = async () => callback(getLPMSProvider<TLPMSProvider>());
  const unsubscribe = client.subscribe(
    ({ provider }) => provider,
    handleChange,
  );
  return unsubscribe;
}
