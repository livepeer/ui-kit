import { getAssetMetrics } from '@livepeer/core/actions';
import { ClientConfig, createClient } from '@livepeer/core/client';
import {
  GetAssetMetricsArgs,
  LivepeerProvider,
  LivepeerProviderConfig,
  Metrics,
} from '@livepeer/core/types';
import { pick } from '@livepeer/core/utils';

import {
  PrefetchQueryOptions,
  UsePickQueryOptions,
  prefetchQuery,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = (
  args: GetAssetMetricsArgs,
  config: LivepeerProviderConfig,
) => [{ entity: 'getAssetMetrics', args, config }] as const;

export type UseAssetMetricsArgs<TData> = PrefetchQueryOptions &
  Partial<GetAssetMetricsArgs> &
  Partial<UsePickQueryOptions<Metrics, TData, ReturnType<typeof queryKey>>>;

export function useAssetMetrics<
  TLivepeerProvider extends LivepeerProvider,
  TData = Metrics,
>(args: UseAssetMetricsArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery<Metrics, TData, ReturnType<typeof queryKey>>(
    getQueryParams(args, livepeerProvider),
  );
}

export async function prefetchAssetMetrics<
  TLivepeerProvider extends LivepeerProvider,
  TData = Metrics,
>(
  args: UseAssetMetricsArgs<TData>,
  config: Omit<ClientConfig<TLivepeerProvider>, 'storage'> &
    PrefetchQueryOptions,
) {
  const livepeerClient = createClient(config);

  return prefetchQuery(getQueryParams(args, livepeerClient.provider));
}

function getQueryParams<
  TLivepeerProvider extends LivepeerProvider,
  TData = Metrics,
>(args: UseAssetMetricsArgs<TData>, provider: TLivepeerProvider) {
  const getAssetMetricsArgs: GetAssetMetricsArgs = {
    assetId: args?.assetId ?? '',
  };

  return {
    clearClient: args.clearClient,
    queryKey: queryKey(getAssetMetricsArgs, provider.getConfig()),
    queryFn: async () =>
      getAssetMetrics<TLivepeerProvider>(args as GetAssetMetricsArgs),
    enabled: Boolean(args?.assetId),
    ...(typeof args === 'object' ? pick(args, ...usePickQueryKeys) : {}),
  };
}
