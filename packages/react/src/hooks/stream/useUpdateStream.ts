import {
  LivepeerProvider,
  Stream,
  UpdateStreamArgs,
  updateStream,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useUpdateStream<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<
    UseInternalMutationOptions<Stream, Error, UpdateStreamArgs>
  >,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    async (args: UpdateStreamArgs) => updateStream<TLivepeerProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateStream', livepeerProvider }],
      ...options,
    },
  );
}
