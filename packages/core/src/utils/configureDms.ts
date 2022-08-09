import { DmsProviderFn } from '../providers/base';
import { DmsProvider } from '../types';

export function configureDms<TProvider extends DmsProvider = DmsProvider>(
  providerFns: DmsProviderFn<TProvider>[],
) {
  if (!providerFns.length) throw new Error('must have at least provider');

  const providers: (TProvider | null)[] = providerFns.map(
    (providerFn) => providerFn?.()?.provider() ?? null,
  );

  return {
    providers,
  } as const;
}
