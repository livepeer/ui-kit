import { useQuery } from '@tanstack/react-query';
import { GetStreamArgs, LPMSProvider, getStream } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useStream<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetStreamArgs>,
) {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStream', args, lpmsProvider }],
    queryFn: async () => getStream<TLPMSProvider>(args as GetStreamArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
  });
}
