import { GetStreamSessionArgs, LPMSProvider, StreamSession } from '../../types';

import { getLPMSProvider } from '../providers';

export function getStreamSession<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>(args: GetStreamSessionArgs): Promise<StreamSession> {
  const provider = getLPMSProvider<TLPMSProvider>();

  return provider.getStreamSession(args);
}
