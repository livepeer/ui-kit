import { defaultTranscodingProfiles } from '../../constants';
import { CreateStreamArgs, LPMSProvider, Stream } from '../../types';
import { getLPMSProvider } from '../providers';

export function createStream<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>({
  name,
  profiles = defaultTranscodingProfiles,
}: CreateStreamArgs): Promise<Stream> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.createStream({ name, profiles });
}
