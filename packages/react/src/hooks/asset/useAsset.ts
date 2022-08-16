import { Asset, GetAssetArgs, LPMSProvider, getAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalQueryOptions, useInternalQuery } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useAsset<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetAssetArgs> & Partial<UseInternalQueryOptions<Asset>>,
) {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useInternalQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getAsset', args, lpmsProvider }],
    queryFn: async () => getAsset<TLPMSProvider>(args as GetAssetArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.assetId),
    ...(typeof args === 'object' ? args : {}),
  });
}
