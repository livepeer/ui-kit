import { Asset, LPMSProvider, UpdateAssetArgs, updateAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useUpdateAsset<TLPMSProvider extends LPMSProvider>(
  options?: Partial<UseInternalMutationOptions<Asset, Error, UpdateAssetArgs>>,
) {
  const lpmsProvider = useLPMSProvider<TLPMSProvider>();

  return useInternalMutation(
    async (args: UpdateAssetArgs) => updateAsset<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateAsset', lpmsProvider }],
      ...options,
    },
  );
}
