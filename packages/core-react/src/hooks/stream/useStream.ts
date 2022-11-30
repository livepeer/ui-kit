import { getStream } from 'livepeer/actions';
import { ClientConfig, createClient } from 'livepeer/client';
import {
  GetStreamArgs,
  LivepeerProvider,
  LivepeerProviderConfig,
  Stream,
} from 'livepeer/types';
import { pick } from 'livepeer/utils';

import {
  PrefetchQueryOptions,
  UsePickQueryOptions,
  prefetchQuery,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = (args: GetStreamArgs, config: LivepeerProviderConfig) =>
  [{ entity: 'getStream', args, config }] as const;

export type UseStreamArgs<TData> = PrefetchQueryOptions &
  Partial<GetStreamArgs> &
  Partial<UsePickQueryOptions<Stream, TData, ReturnType<typeof queryKey>>>;

export function useStream<
  TLivepeerProvider extends LivepeerProvider,
  TData = Stream,
>(args: UseStreamArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery<Stream, TData, ReturnType<typeof queryKey>>(
    getQueryParams(args, livepeerProvider),
  );
}

export async function prefetchStream<
  TLivepeerProvider extends LivepeerProvider,
  TData = Stream,
>(
  args: UseStreamArgs<TData>,
  config: Omit<ClientConfig<TLivepeerProvider>, 'storage'>,
) {
  const livepeerClient = createClient(config);

  return prefetchQuery(getQueryParams(args, livepeerClient.provider));
}

function getQueryParams<
  TLivepeerProvider extends LivepeerProvider,
  TData = Stream,
>(args: UseStreamArgs<TData>, provider: TLivepeerProvider) {
  const getStreamArgs: GetStreamArgs =
    typeof args === 'string' ? args : { streamId: args?.streamId ?? '' };

  return {
    clearClient: args.clearClient,
    queryKey: queryKey(getStreamArgs, provider.getConfig()),
    queryFn: async () => getStream<TLivepeerProvider>(getStreamArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
    ...(typeof args === 'object' ? pick(args, ...usePickQueryKeys) : {}),
  };
}
