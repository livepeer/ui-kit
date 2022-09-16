import {
  GetMetricsArgs,
  LivepeerProvider,
  Metrics,
  getMetrics,
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
  args: GetMetricsArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getMetrics', args, livepeerProvider }] as const;

export type UseAssetMetricsArgs<TData> = Partial<GetMetricsArgs> &
  Partial<UsePickQueryOptions<Metrics, TData, ReturnType<typeof queryKey>>>;

export function useAssetMetrics<
  TLivepeerProvider extends LivepeerProvider,
  TData = Metrics,
>(args: UseAssetMetricsArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<LivepeerProvider>();

  const getMetricsArgs: GetMetricsArgs = useMemo(() => {
    return { assetId: args?.assetId ?? '' };
  }, [args]);

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: queryKey(getMetricsArgs, livepeerProvider),
    queryFn: async () => getMetrics<TLivepeerProvider>(args as GetMetricsArgs),
    enabled: Boolean(args?.assetId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
