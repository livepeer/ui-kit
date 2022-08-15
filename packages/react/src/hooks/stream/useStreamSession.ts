import {
  GetStreamSessionArgs,
  LPMSProvider,
  StreamSession,
  getStreamSession,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalQueryOptions, useInternalQuery } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useStreamSession<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetStreamSessionArgs> &
    Partial<UseInternalQueryOptions<StreamSession>>,
) {
  const lpmsProvider = useLPMSProvider<TLPMSProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStreamSession', args, lpmsProvider }],
    queryFn: async () =>
      getStreamSession<TLPMSProvider>(args as GetStreamSessionArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamSessionId),
    ...(typeof args === 'object' ? args : {}),
  });
}
