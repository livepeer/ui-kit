import { createClip } from '@livepeer/core/actions';
import { Asset, CreateClipArgs, LivepeerProvider } from '@livepeer/core/types';

import { UseInternalMutationOptions, useInternalMutation } from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateClip<TLivepeerProvider extends LivepeerProvider>(
  options: UseInternalMutationOptions<Asset, CreateClipArgs>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  return useInternalMutation(
    options,
    async (args: CreateClipArgs) => createClip<TLivepeerProvider>(args),
    [{ entity: 'createClip', livepeerProvider }],
  );
}
