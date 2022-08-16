import { LivepeerProvider, Stream, UpdateStreamArgs } from '../../types';
import { getLivepeerProvider } from '../providers';

export function updateStream<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: UpdateStreamArgs): Promise<Stream> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.updateStream(args);
}
