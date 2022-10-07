import { getAsset } from 'livepeer/actions';
import { Asset, GetAssetArgs, LivepeerProvider } from 'livepeer/types';
import { pick } from 'livepeer/utils';

import { useMemo } from 'react';

import { QueryClientContext } from '../../context';
import {
  UsePickQueryOptions,
  useInternalQuery,
  usePickQueryKeys,
} from '../../utils';
import { useLivepeerProvider } from '../providers';

export const queryKey = <TLivepeerProvider extends LivepeerProvider>(
  args: GetAssetArgs,
  livepeerProvider: TLivepeerProvider,
) => [{ entity: 'getAsset', args, livepeerProvider }] as const;

export type UseAssetArgs<TData> = Partial<GetAssetArgs> &
  Partial<UsePickQueryOptions<Asset, TData, ReturnType<typeof queryKey>>>;

export function useAsset<
  TLivepeerProvider extends LivepeerProvider,
  TData = Asset,
>(args: UseAssetArgs<TData>) {
  const livepeerProvider = useLivepeerProvider<TLivepeerProvider>();

  const getAssetArgs: GetAssetArgs = useMemo(
    () => (typeof args === 'string' ? args : { assetId: args?.assetId ?? '' }),
    [args],
  );

  return useInternalQuery<Asset, TData, ReturnType<typeof queryKey>>({
    context: QueryClientContext,
    queryKey: queryKey(getAssetArgs, livepeerProvider),
    queryFn: async () => getAsset<TLivepeerProvider>(getAssetArgs),
    enabled: Boolean(typeof args === 'string' ? args : args?.assetId),
    ...(typeof args === 'object' ? pick(args, usePickQueryKeys) : {}),
  });
}
