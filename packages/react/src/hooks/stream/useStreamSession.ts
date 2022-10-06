import {
  ClientConfig,
  GetStreamSessionArgs,
  LivepeerProvider,
  LivepeerProviderConfig,
  StreamSession,
  createClient,
  getStreamSession,
  pick,
} from 'livepeer';

import {
  PrefetchQueryOptions,
  UsePickQueryOptions,
  prefetchQuery,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = (
  args: GetStreamSessionArgs,
  config: LivepeerProviderConfig,
) => [{ entity: 'getStreamSession', args, config }] as const;

export type UseStreamSessionArgs<TData> = PrefetchQueryOptions &
  Partial<GetStreamSessionArgs> &
  Partial<
    UsePickQueryOptions<StreamSession, TData, ReturnType<typeof queryKey>>
  >;

export function useStreamSession<
  TLivepeerProvider extends LivepeerProvider,
  TData = StreamSession,
>(args: UseStreamSessionArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery<StreamSession, TData, ReturnType<typeof queryKey>>(
    getQueryParams(args, livepeerProvider),
  );
}

export async function prefetchStreamSession<
  TLivepeerProvider extends LivepeerProvider,
  TData = StreamSession,
>(
  args: UseStreamSessionArgs<TData>,
  config: Omit<ClientConfig<TLivepeerProvider>, 'storage'>,
) {
  const livepeerClient = createClient(config);

  return prefetchQuery(getQueryParams(args, livepeerClient.provider));
}

function getQueryParams<
  TLivepeerProvider extends LivepeerProvider,
  TData = StreamSession,
>(args: UseStreamSessionArgs<TData>, provider: TLivepeerProvider) {
  const getStreamSessionArgs: GetStreamSessionArgs =
    typeof args === 'string'
      ? args
      : { streamSessionId: args?.streamSessionId ?? '' };

  return {
    clearClient: args.clearClient,
    queryKey: queryKey(getStreamSessionArgs, provider.getConfig()),
    queryFn: async () =>
      getStreamSession<TLivepeerProvider>(getStreamSessionArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamSessionId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  };
}
