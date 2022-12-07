import { updateStream } from '@livepeer/core/actions';
import {
  LivepeerProvider,
  Stream,
  UpdateStreamArgs,
} from '@livepeer/core/types';

import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useUpdateStream<TLivepeerProvider extends LivepeerProvider>(
  options: UseInternalMutationOptions<Stream, UpdateStreamArgs>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    options,
    async (args: UpdateStreamArgs) => updateStream<TLivepeerProvider>(args),
    [{ entity: 'updateStream', livepeerProvider }],
  );
}
