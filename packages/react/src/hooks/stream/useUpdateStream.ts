import { LPMSProvider, Stream, UpdateStreamArgs, updateStream } from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLPMSProvider } from '../providers';

export function useUpdateStream<TLPMSProvider extends LPMSProvider>(
  options?: Partial<
    UseInternalMutationOptions<Stream, Error, UpdateStreamArgs>
  >,
) {
  const lpmsProvider = useLPMSProvider<TLPMSProvider>();

  return useInternalMutation(
    async (args: UpdateStreamArgs) => updateStream<TLPMSProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateStream', lpmsProvider }],
      ...options,
    },
  );
}
