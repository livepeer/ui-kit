import { GetStreamArgs, LPMSProvider, Stream } from '../../types';
import { getLPMSProvider } from '../providers';

export function getStream<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  args: GetStreamArgs,
): Promise<Stream> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.getStream(args);
}
