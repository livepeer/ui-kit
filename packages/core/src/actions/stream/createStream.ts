import { defaultTranscodingProfiles } from '../../constants';
import { CreateStreamArgs, LivepeerProvider, Stream } from '../../types';
import { getLivepeerProvider } from '../providers';

export function createStream<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: CreateStreamArgs): Promise<Stream> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.createStream({
    ...args,
    profiles: args?.profiles ?? defaultTranscodingProfiles,
  });
}
