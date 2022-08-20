import {
  GetStreamSessionArgs,
  LivepeerProvider,
  StreamSession,
  getStreamSession,
  pick,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UseInternalQueryOptions,
  useInternalQuery,
  useInternalQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useStreamSession<TLivepeerProvider extends LivepeerProvider>(
  args: Partial<GetStreamSessionArgs> &
    Partial<UseInternalQueryOptions<StreamSession>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStreamSession', args, livepeerProvider }],
    queryFn: async () =>
      getStreamSession<TLivepeerProvider>(args as GetStreamSessionArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamSessionId),
    ...(typeof args === 'object' ? pick(args, useInternalQueryKeys) : {}),
  });
}
