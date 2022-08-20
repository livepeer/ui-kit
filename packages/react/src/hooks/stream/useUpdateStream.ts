import {
  LivepeerProvider,
  Stream,
  UpdateStreamArgs,
  pick,
  updateStream,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UseInternalMutationOptions,
  useInternalMutation,
  useInternalMutationKeys,
} from '../../utils';
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
      ...(typeof options === 'object'
        ? pick(options, useInternalMutationKeys)
        : {}),
    },
  );
}
