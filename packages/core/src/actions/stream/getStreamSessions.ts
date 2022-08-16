import {
  GetStreamSessionsArgs,
  LivepeerProvider,
  StreamSession,
} from '../../types';

import { getLivepeerProvider } from '../providers';

export function getStreamSessions<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetStreamSessionsArgs): Promise<StreamSession[]> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.getStreamSessions(args);
}
