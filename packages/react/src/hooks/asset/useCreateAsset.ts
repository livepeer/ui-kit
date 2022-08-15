import { useMutation } from '@tanstack/react-query';
import { CreateAssetArgs, LPMSProvider, createAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useCreateAsset<TLPMSProvider extends LPMSProvider>() {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useMutation(
    async (args: CreateAssetArgs) => createAsset<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createAsset', lpmsProvider }],
    },
  );
}
