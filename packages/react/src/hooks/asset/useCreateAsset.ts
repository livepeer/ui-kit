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

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const mutation = useInternalMutation(
    async (args: CreateAssetArgs) => {
      let asset: Asset | null = null;
      asset = await createAsset<TLivepeerProvider>({
        ...args,
        onUploadProgress: (p) =>
          setUploadProgress((s) => (!asset ? s : { ...s, [asset.id]: p })),
      });
      return asset;
    },
    {
      context: QueryClientContext,
      mutationKey: [{ entity: 'createAsset', livepeerProvider }],
      ...(typeof options === 'object'
        ? pick(options, usePickMutationKeys)
        : {}),
    },
  );
  return {
    ...mutation,
    uploadProgress,
  };
}
