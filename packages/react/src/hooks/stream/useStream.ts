import { getStream } from 'livepeer/actions';
import { GetStreamArgs, LivepeerProvider, Stream } from 'livepeer/types';
import { pick } from 'livepeer/utils';
import { useMemo } from 'react';

import { QueryClientContext } from '../../context';
import {
  UsePickQueryOptions,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = <TLivepeerProvider extends LivepeerProvider>(
  args: GetStreamArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getStream', args, livepeerProvider }] as const;

export type UseStreamArgs<TData> = Partial<GetStreamArgs> &
  Partial<UsePickQueryOptions<Stream, TData, ReturnType<typeof queryKey>>>;

export function useStream<
  TLivepeerProvider extends LivepeerProvider,
  TData = Stream,
>(args: UseStreamArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  const getStreamArgs: GetStreamArgs = useMemo(
    () =>
      typeof args === 'string' ? args : { streamId: args?.streamId ?? '' },
    [args],
  );

  return useInternalQuery<Stream, TData, ReturnType<typeof queryKey>>({
    context: QueryClientContext,
    queryKey: queryKey(getStreamArgs, livepeerProvider),
    queryFn: async () => getStream<TLivepeerProvider>(getStreamArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.streamId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
