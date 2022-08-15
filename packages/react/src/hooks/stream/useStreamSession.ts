import { useQuery } from '@tanstack/react-query';
import { GetStreamSessionArgs, LPMSProvider, getStreamSession } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useStreamSession<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetStreamSessionArgs>,
) {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStreamSession', args, lpmsProvider }],
    queryFn: async () =>
      getStreamSession<TLPMSProvider>(args as GetStreamSessionArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamSessionId),
  });
}
