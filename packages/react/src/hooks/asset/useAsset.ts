import { Asset, GetAssetArgs, LivepeerProvider, getAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalQueryOptions, useInternalQuery } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useAsset<TLivepeerProvider extends LivepeerProvider>(
  args?: Partial<GetAssetArgs> & Partial<UseInternalQueryOptions<Asset>>,
) {
  const livepeerProvider = useLivepeerProvider<LivepeerProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getAsset', args, livepeerProvider }],
    queryFn: async () => getAsset<TLivepeerProvider>(args as GetAssetArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.assetId),
    ...(typeof args === 'object' ? args : {}),
  });
}
