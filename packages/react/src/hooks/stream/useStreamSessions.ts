import { useQuery } from '@tanstack/react-query';
import {
  GetStreamSessionsArgs,
  LPMSProvider,
  getStreamSessions,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useStreamSessions<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetStreamSessionsArgs>,
) {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStreamSessions', args, lpmsProvider }],
    queryFn: async () =>
      getStreamSessions<TLPMSProvider>(args as GetStreamSessionsArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
  });
}
