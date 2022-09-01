import {
  GetStreamSessionArgs,
  LivepeerProvider,
  StreamSession,
  getStreamSession,
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
  args: GetStreamSessionArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getStreamSession', args, livepeerProvider }] as const;

export type UseStreamSessionArgs<TData> = Partial<GetStreamSessionArgs> &
  Partial<
    UsePickQueryOptions<StreamSession, TData, ReturnType<typeof queryKey>>
  >;

export function useStreamSession<
  TLivepeerProvider extends LivepeerProvider,
  TData = StreamSession,
>(args: UseStreamSessionArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  const getStreamSessionArgs: GetStreamSessionArgs = useMemo(
    () =>
      typeof args === 'string'
        ? args
        : { streamSessionId: args?.streamSessionId ?? '' },
    [args],
  );

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: queryKey(getStreamSessionArgs, livepeerProvider),
    queryFn: async () =>
      getStreamSession<TLivepeerProvider>(getStreamSessionArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamSessionId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
