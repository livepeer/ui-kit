import { LPMSProvider, Stream, UpdateStreamArgs } from '../../types';
import { getLPMSProvider } from '../providers';

export function updateStream<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: UpdateStreamArgs,
): Promise<Stream> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.updateStream(args);
}
