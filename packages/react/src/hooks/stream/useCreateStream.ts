import { CreateStreamArgs, LPMSProvider, Stream, createStream } from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useCreateStream<TLPMSProvider extends LPMSProvider>(
  options?: Partial<
    UseInternalMutationOptions<Stream, Error, CreateStreamArgs>
  >,
) {
  const lpmsProvider = useLPMSProvider<TLPMSProvider>();

  return useInternalMutation(
    async (args: CreateStreamArgs) => createStream<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createStream', lpmsProvider }],
      ...options,
    },
  );
}
