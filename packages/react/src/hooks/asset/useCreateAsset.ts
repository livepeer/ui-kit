import {
  Asset,
  CreateAssetArgs,
  LivepeerProvider,
  createAsset,
  pick,
} from 'livepeer';
import { useState } from 'react';

import { QueryClientContext } from '../../context';
import {
  UsePickMutationOptions,
  useInternalMutation,
  usePickMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateAsset<TLivepeerProvider extends LivepeerProvider>(
  options?: Partial<
    UsePickMutationOptions<
      Asset,
      Error,
      Omit<CreateAssetArgs, 'onUploadProgress'>
    >
  >,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  const [uploadProgress, setUploadProgress] = useState(0);
  const internalQuery = useInternalMutation(
    async (args: CreateAssetArgs) =>
      createAsset<TLivepeerProvider>({
        ...args,
        onUploadProgress: setUploadProgress,
      }),
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createAsset', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, usePickMutationKeys)
        : {}),
    },
  );
  return {
    ...internalQuery,
    data: internalQuery?.data && {
      asset: internalQuery.data,
      uploadProgress,
    },
  };
}
