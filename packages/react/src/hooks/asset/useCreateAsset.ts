import { createAsset } from 'livepeer/actions';
import { Asset, CreateAssetArgs, LivepeerProvider } from 'livepeer/types';
import { pick } from 'livepeer/utils';
import { useState } from 'react';

import { QueryClientContext } from '../../context';
import {
  UsePickMutationOptions,
  useInternalMutation,
  usePickMutationKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export function useCreateAsset<TLivepeerProvider extends LivepeerProvider>(
  options?: <TData = Asset[], TError = Error>(
    provider: TLivepeerProvider,
  ) => UsePickMutationOptions<TData, TError, CreateAssetArgs>,
) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  const [uploadProgress, setUploadProgress] = useState<number[] | undefined>(
    undefined,
  );

  const internalQuery = useInternalMutation(
    async (args: CreateAssetArgs[]) =>
      Promise.all(
        args.map((arg, index) =>
          createAsset<TLivepeerProvider>({
            ...arg,
            onUploadProgress: (progress) =>
              setUploadProgress((prev) => {
                const next = [...(prev || [])];
                next[index] = progress;
                return next;
              }),
          }),
        ),
      ),
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
    uploadProgress,
  } as const;
}
