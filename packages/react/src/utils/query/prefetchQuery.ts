import {
  DehydratedState,
  FetchQueryOptions,
  QueryKey,
  dehydrate,
} from '@tanstack/react-query';

import { defaultQueryClient } from '../../client';
import { InternalQueryError } from './useInternalQuery';

export async function prefetchQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: FetchQueryOptions<
    TQueryFnData,
    InternalQueryError,
    TData,
    TQueryKey
  >,
): Promise<DehydratedState> {
  try {
    const client = defaultQueryClient();

    await client.prefetchQuery(options);

    return dehydrate(client);
  } catch (e) {
    console.warn(e);
    return { mutations: [], queries: [] };
  }
}
