import {
  getLivepeerProvider,
  watchLivepeerProvider,
} from '@livepeer/core/actions';
import { LivepeerProvider } from '@livepeer/core/types';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector.js';

export function useLivepeerProvider<
  TLivepeerProvider extends LivepeerProvider,
>() {
  return useSyncExternalStoreWithSelector(
    (cb) => watchLivepeerProvider<TLivepeerProvider>(cb),
    () => getLivepeerProvider<TLivepeerProvider>(),
    () => getLivepeerProvider<TLivepeerProvider>(),
    (x) => x,
  );
}
