import {
  GetPlaybackInfoArgs,
  LivepeerProvider,
  PlaybackInfo,
  getPlaybackInfo,
  pick,
} from 'livepeer';
import { useMemo } from 'react';

import { QueryClientContext } from '../../context';
import {
  UsePickQueryOptions,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = <TLivepeerProvider extends LivepeerProvider>(
  args: GetPlaybackInfoArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getPlaybackInfo', args, livepeerProvider }] as const;

export type UsePlaybackInfoArgs<TData> = Partial<GetPlaybackInfoArgs> &
  Partial<
    UsePickQueryOptions<PlaybackInfo, TData, ReturnType<typeof queryKey>>
  >;

export function usePlaybackInfo<
  TLivepeerProvider extends LivepeerProvider,
  TData = PlaybackInfo,
>(args: UsePlaybackInfoArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<LivepeerProvider>();

  const getPlaybackInfoArgs: GetPlaybackInfoArgs = useMemo(
    () =>
      typeof args === 'string' ? args : { playbackId: args?.playbackId ?? '' },
    [args],
  );

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: queryKey(getPlaybackInfoArgs, livepeerProvider),
    queryFn: async () =>
      getPlaybackInfo<TLivepeerProvider>(args as GetPlaybackInfoArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.playbackId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
