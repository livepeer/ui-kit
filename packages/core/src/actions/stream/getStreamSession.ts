import {
  GetStreamSessionArgs,
  LivepeerProvider,
  StreamSession,
} from '../../types';

import { getLivepeerProvider } from '../providers';

export function getStreamSession<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetStreamSessionArgs): Promise<StreamSession> {
  const provider = getLivepeerProvider<TLivepeerProvider>();

  return provider.getStreamSession(args);
}
