import { updateAsset } from '@livepeer/core/actions';
import { Asset, LivepeerProvider, UpdateAssetArgs } from '@livepeer/core/types';

import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useUpdateAsset<TLivepeerProvider extends LivepeerProvider>(
  options: UseInternalMutationOptions<Asset, UpdateAssetArgs>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    options,
    async (args: UpdateAssetArgs) => updateAsset<TLivepeerProvider>(args),
    [{ entity: 'updateAsset', livepeerProvider }],
  );
}
