import {
  GetAssetMetricsArgs,
  LivepeerProvider,
  Metrics,
  getAssetMetrics,
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
  args: GetAssetMetricsArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getAssetMetrics', args, livepeerProvider }] as const;

export type UseAssetMetricsArgs<TData> = Partial<GetAssetMetricsArgs> &
  Partial<UsePickQueryOptions<Metrics, TData, ReturnType<typeof queryKey>>>;

export function useAssetMetrics<
  TLivepeerProvider extends LivepeerProvider,
  TData = Metrics,
>(args: UseAssetMetricsArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<LivepeerProvider>();

  const getAssetMetricsArgs: GetAssetMetricsArgs = useMemo(() => {
    return { assetId: args?.assetId ?? '' };
  }, [args]);

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: queryKey(getAssetMetricsArgs, livepeerProvider),
    queryFn: async () =>
      getAssetMetrics<TLivepeerProvider>(args as GetAssetMetricsArgs),
    enabled: Boolean(args?.assetId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
