import {
  GetStreamSessionsArgs,
  LivepeerProvider,
  StreamSession,
  getStreamSessions,
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
  args: GetStreamSessionsArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getStreamSessions', args, livepeerProvider }] as const;

export type UseStreamSessionsArgs<TData> = Partial<GetStreamSessionsArgs> &
  Partial<
    UsePickQueryOptions<StreamSession[], TData, ReturnType<typeof queryKey>>
  >;

export function useStreamSessions<
  TLivepeerProvider extends LivepeerProvider,
  TData = StreamSession[],
>(args: UseStreamSessionsArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  const getStreamSessionsArgs: GetStreamSessionsArgs = useMemo(
    () =>
      typeof args === 'string' ? args : { streamId: args?.streamId ?? '' },
    [args],
  );

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: queryKey(getStreamSessionsArgs, livepeerProvider),
    queryFn: async () =>
      getStreamSessions<TLivepeerProvider>(getStreamSessionsArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
