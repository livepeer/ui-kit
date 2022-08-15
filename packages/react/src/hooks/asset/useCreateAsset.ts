import { Asset, CreateAssetArgs, LPMSProvider, createAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useCreateAsset<TLPMSProvider extends LPMSProvider>(
  options?: Partial<UseInternalMutationOptions<Asset, Error, CreateAssetArgs>>,
) {
  const lpmsProvider = useLPMSProvider<TLPMSProvider>();

  return useInternalMutation(
    async (args: CreateAssetArgs) => createAsset<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createAsset', lpmsProvider }],
      ...options,
    },
  );
}
