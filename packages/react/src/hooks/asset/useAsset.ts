import { useQuery } from '@tanstack/react-query';
import { GetAssetArgs, LPMSProvider, getAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useAsset<TLPMSProvider extends LPMSProvider>(
  args?: Partial<GetAssetArgs>,
) {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useQuery({
    context: QueryClientContext,
    queryKey: [{ entity: 'getAsset', args, lpmsProvider }],
    queryFn: async () => getAsset<TLPMSProvider>(args as GetAssetArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.assetId),
  });
}
