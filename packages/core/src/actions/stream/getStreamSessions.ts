import {
  GetStreamSessionsArgs,
  LPMSProvider,
  StreamSession,
} from '../../types';

import { getLPMSProvider } from '../providers';

export function getStreamSessions<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>(args: GetStreamSessionsArgs): Promise<StreamSession[]> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.getStreamSessions(args);
}
