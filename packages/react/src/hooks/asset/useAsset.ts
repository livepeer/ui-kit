import {
  Asset,
  ClientConfig,
  GetAssetArgs,
  LivepeerProvider,
  LivepeerProviderConfig,
  Metrics,
  createClient,
  getAsset,
  pick,
} from 'livepeer';

import {
  UsePickQueryOptions,
  prefetchQuery,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = (args: GetAssetArgs, config: LivepeerProviderConfig) =>
  [{ entity: 'getAsset', args, config }] as const;

export type UseAssetArgs<TData> = Partial<GetAssetArgs> &
  Partial<UsePickQueryOptions<Asset, TData, ReturnType<typeof queryKey>>>;

export function useAsset<
  TLivepeerProvider extends LivepeerProvider,
  TData = Asset,
>(args: UseAssetArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalQuery(getQueryParams(args, livepeerProvider));
}

export async function prefetchAsset<
  TLivepeerProvider extends LivepeerProvider,
  TData = Asset,
>(
  args: UseAssetArgs<TData>,
  config: Omit<ClientConfig<TLivepeerProvider>, 'storage'>,
) {
  const livepeerClient = createClient(config);

  return prefetchQuery(getQueryParams(args, livepeerClient.provider));
}

function getQueryParams<
  TLivepeerProvider extends LivepeerProvider,
  TData = Metrics,
>(args: UseAssetArgs<TData>, provider: TLivepeerProvider) {
  const getAssetArgs: GetAssetArgs =
    typeof args === 'string' ? args : { assetId: args?.assetId ?? '' };

  return {
    queryKey: queryKey(getAssetArgs, provider.getConfig()),
    queryFn: async () => getAsset<TLivepeerProvider>(getAssetArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.assetId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  };
}
