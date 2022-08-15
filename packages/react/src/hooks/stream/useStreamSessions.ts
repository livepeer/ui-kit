import {
  GetStreamSessionsArgs,
  LPMSProvider,
  StreamSession,
  getStreamSessions,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalQueryOptions, useInternalQuery } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useStreamSessions<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetStreamSessionsArgs> &
    Partial<UseInternalQueryOptions<StreamSession[]>>,
) {
  const lpmsProvider = useLPMSProvider<TLPMSProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStreamSessions', args, lpmsProvider }],
    queryFn: async () =>
      getStreamSessions<TLPMSProvider>(args as GetStreamSessionsArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
    ...(typeof args === 'object' ? args : {}),
  });
}
