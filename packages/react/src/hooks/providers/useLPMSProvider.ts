import { LPMSProvider, getLPMSProvider, watchLPMSProvider } from 'livepeer';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js';

export function useLPMSProvider<TLPMSProvider extends LPMSProvider>() {
  return useSyncExternalStoreWithSelector(
    (cb) => watchLPMSProvider<TLPMSProvider>(cb),
    () => getLPMSProvider<TLPMSProvider>(),
    () => getLPMSProvider<TLPMSProvider>(),
    (x) => x,
  );
}
