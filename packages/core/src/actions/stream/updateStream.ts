import { LPMSProvider, UpdateStreamArgs } from '../../types';
import { getLPMSProvider } from '../providers';

export function updateStream<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: UpdateStreamArgs,
): Promise<void> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.updateStream(args);
}
