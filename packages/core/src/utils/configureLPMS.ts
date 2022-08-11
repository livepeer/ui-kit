import { LPMSProviderFn } from '../providers/base';
import { LPMSProvider } from '../types';

export function configureLPMS<TProvider extends LPMSProvider = LPMSProvider>(
  providerFns: LPMSProviderFn<TProvider>[],
) {
  if (!providerFns.length) throw new Error('must have at least provider');

  const providers: (TProvider | null)[] = providerFns.map(
    (providerFn) => providerFn?.()?.provider ?? null,
  );

  return {
    providers,
  } as const;
}
