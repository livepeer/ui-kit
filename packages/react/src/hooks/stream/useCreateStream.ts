import {
  CreateStreamArgs,
  LivepeerProvider,
  Stream,
  createStream,
  pick,
} from 'livepeer';

import { QueryClientContext } from '../../context';
import {
  UseInternalMutationOptions,
  useInternalMutation,
  useInternalMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateStream<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<
    UseInternalMutationOptions<Stream, Error, CreateStreamArgs>
  >,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    async (args: CreateStreamArgs) => createStream<TLivepeerProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createStream', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, useInternalMutationKeys)
        : {}),
    },
  );
}
