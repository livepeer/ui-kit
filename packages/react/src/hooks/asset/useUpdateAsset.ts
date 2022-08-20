import {
  Asset,
  LivepeerProvider,
  UpdateAssetArgs,
  pick,
  updateAsset,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UseInternalMutationOptions,
  useInternalMutation,
  useInternalMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useUpdateAsset<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<UseInternalMutationOptions<Asset, Error, UpdateAssetArgs>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    async (args: UpdateAssetArgs) => updateAsset<TLivepeerProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateAsset', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, useInternalMutationKeys)
        : {}),
    },
  );
}
