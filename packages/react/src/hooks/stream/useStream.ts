import {
  GetStreamArgs,
  LivepeerProvider,
  Stream,
  getStream,
  pick,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UseInternalQueryOptions,
  useInternalQuery,
  useInternalQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useStream<TLivepeerProvider extends LivepeerProvider>(
  args: Partial<GetStreamArgs> & Partial<UseInternalQueryOptions<Stream>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getStream', args, livepeerProvider }],
    queryFn: async () => getStream<TLivepeerProvider>(args as GetStreamArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
    ...(typeof args === 'object' ? pick(args, useInternalQueryKeys) : {}),
  });
}
