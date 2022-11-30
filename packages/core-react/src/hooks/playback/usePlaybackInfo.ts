import { getPlaybackInfo } from 'livepeer/actions';
import { ClientConfig, createClient } from 'livepeer/client';
import {
  GetPlaybackInfoArgs,
  LivepeerProvider,
  LivepeerProviderConfig,
  PlaybackInfo,
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

export const queryKey = (
  args: GetPlaybackInfoArgs,
  config: LivepeerProviderConfig,
) => [{ entity: 'getPlaybackInfo', args, config }] as const;

export type UsePlaybackInfoArgs<TData> = PrefetchQueryOptions &
  Partial<GetPlaybackInfoArgs> &
  Partial<
    UsePickQueryOptions<PlaybackInfo, TData, ReturnType<typeof queryKey>>
  >;

export function usePlaybackInfo<
  TLivepeerProvider extends LivepeerProvider,
  TData = PlaybackInfo,
>(args: UsePlaybackInfoArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery<PlaybackInfo, TData, ReturnType<typeof queryKey>>(
    getQueryParams(args, livepeerProvider),
  );
}

export async function prefetchPlaybackInfo<
  TLivepeerProvider extends LivepeerProvider,
  TData = PlaybackInfo,
>(
  args: UsePlaybackInfoArgs<TData>,
  config: Omit<ClientConfig<TLivepeerProvider>, 'storage'>,
) {
  const livepeerClient = createClient(config);

  return prefetchQuery(getQueryParams(args, livepeerClient.provider));
}

function getQueryParams<
  TLivepeerProvider extends LivepeerProvider,
  TData = PlaybackInfo,
>(args: UsePlaybackInfoArgs<TData>, provider: TLivepeerProvider) {
  const getPlaybackInfoArgs: GetPlaybackInfoArgs =
    typeof args === 'string' ? args : { playbackId: args?.playbackId ?? '' };

  return {
    clearClient: args.clearClient,
    queryKey: queryKey(getPlaybackInfoArgs, provider.getConfig()),
    queryFn: async () =>
      getPlaybackInfo<TLivepeerProvider>(args as GetPlaybackInfoArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.playbackId),
    ...(typeof args === 'object' ? pick(args, ...usePickQueryKeys) : {}),
  };
}
