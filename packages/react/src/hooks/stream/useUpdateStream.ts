import { useMutation } from '@tanstack/react-query';
import { LPMSProvider, UpdateStreamArgs, updateStream } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useUpdateStream<TLPMSProvider extends LPMSProvider>() {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useMutation(
    async (args: UpdateStreamArgs) => updateStream<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateStream', lpmsProvider }],
    },
  );
}
