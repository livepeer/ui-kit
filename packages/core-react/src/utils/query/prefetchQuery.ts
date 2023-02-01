import {
  DehydratedState,
  FetchQueryOptions,
  QueryKey,
  dehydrate,
} from '@tanstack/react-query';

import { InternalQueryError } from './useInternalQuery';
import { defaultQueryClient } from '../../client';

export type PrefetchQueryOptions = {
  clearClient?: boolean;
};

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
  > &
    PrefetchQueryOptions,
): Promise<DehydratedState> {
  try {
    const client = defaultQueryClient();

    await client.prefetchQuery(options);

    const dehydratedState = dehydrate(client);

    if (options?.clearClient) {
      client.clear();
    }

    return dehydratedState;
  } catch (e) {
    console.warn(e);
    return { mutations: [], queries: [] };
  }
}
