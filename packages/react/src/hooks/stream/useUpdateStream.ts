import { updateStream } from 'livepeer/actions';
import { LivepeerProvider, Stream, UpdateStreamArgs } from 'livepeer/types';
import { pick } from 'livepeer/utils';

import { QueryClientContext } from '../../context';
import {
  UsePickMutationOptions,
  useInternalMutation,
  usePickMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useUpdateStream<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<UsePickMutationOptions<Stream, Error, UpdateStreamArgs>>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    async (args: UpdateStreamArgs) => updateStream<TLivepeerProvider>(args),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'updateStream', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, usePickMutationKeys)
        : {}),
    },
  );
}
