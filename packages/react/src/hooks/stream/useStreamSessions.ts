import {
  GetStreamSessionsArgs,
  LivepeerProvider,
  StreamSession,
  getStreamSessions,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalQueryOptions, useInternalQuery } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useStreamSessions<TLivepeerProvider extends LivepeerProvider>(
  args?: Partial<GetStreamSessionsArgs> &
    Partial<UseInternalQueryOptions<StreamSession[]>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStreamSessions', args, livepeerProvider }],
    queryFn: async () =>
      getStreamSessions<TLivepeerProvider>(args as GetStreamSessionsArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
    ...(typeof args === 'object' ? args : {}),
  });
}
