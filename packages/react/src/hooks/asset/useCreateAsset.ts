import {
  Asset,
  CreateAssetArgs,
  LivepeerProvider,
  createAsset,
  pick,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UseInternalMutationOptions,
  useInternalMutation,
  useInternalMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateAsset<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<UseInternalMutationOptions<Asset, Error, CreateAssetArgs>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    async (args: CreateAssetArgs) => createAsset<TLivepeerProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createAsset', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, useInternalMutationKeys)
        : {}),
    },
  );
}
