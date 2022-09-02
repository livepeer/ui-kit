import {
  Asset,
  CreateAssetArgs,
  LivepeerProvider,
  createAsset,
  pick,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UsePickMutationOptions,
  useInternalMutation,
  usePickMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateAsset<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<UsePickMutationOptions<Asset, Error, CreateAssetArgs>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    async (args: CreateAssetArgs) => createAsset<TLivepeerProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createAsset', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, usePickMutationKeys)
        : {}),
    },
  );
}
