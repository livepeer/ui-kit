import { createStream } from 'livepeer/actions';
import { CreateStreamArgs, LivepeerProvider, Stream } from 'livepeer/types';

import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateStream<TLivepeerProvider extends LivepeerProvider>(
  options: UseInternalMutationOptions<Stream, CreateStreamArgs>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    options,
    async (args: CreateStreamArgs) => createStream<TLivepeerProvider>(args),
    [{ entity: 'createStream', livepeerProvider }],
  );
}
