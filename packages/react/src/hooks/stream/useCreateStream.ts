import { useMutation } from '@tanstack/react-query';
import { CreateStreamArgs, LPMSProvider, createStream } from 'livepeer';

import { QueryClientContext } from '../../context';
import { useLPMSProvider } from '../providers';

export function useCreateStream<TLPMSProvider extends LPMSProvider>() {
  const lpmsProvider = useLPMSProvider<LPMSProvider>();

  return useMutation(
    async (args: CreateStreamArgs) => createStream<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createStream', lpmsProvider }],
    },
  );
}
