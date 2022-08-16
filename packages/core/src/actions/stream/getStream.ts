import { GetStreamArgs, LivepeerProvider, Stream } from '../../types';
import { getLivepeerProvider } from '../providers';

export function getStream<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetStreamArgs): Promise<Stream> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.getStream(args);
}
