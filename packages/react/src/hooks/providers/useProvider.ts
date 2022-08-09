import { DmsProvider, getDmsProvider } from 'livepeer';
import { useMemo } from 'react';

export function useProvider<TDmsProvider extends DmsProvider>() {
  const provider = useMemo(() => getDmsProvider<TDmsProvider>(), []);

  return provider;
}
