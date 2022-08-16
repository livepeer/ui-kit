import { defaultTranscodingProfiles } from '../../constants';
import { CreateStreamArgs, LivepeerProvider, Stream } from '../../types';
import { getLivepeerProvider } from '../providers';

export function createStream<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>({
  name,
  profiles = defaultTranscodingProfiles,
}: CreateStreamArgs): Promise<Stream> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.createStream({ name, profiles });
}
