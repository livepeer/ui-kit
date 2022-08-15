import { useMutation } from '@tanstack/react-query';
import { LPMSProvider, UpdateAssetArgs, updateAsset } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useUpdateAsset<TLPMSProvider extends LPMSProvider>() {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useMutation(
    async (args: UpdateAssetArgs) => updateAsset<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateAsset', lpmsProvider }],
    },
  );
}
