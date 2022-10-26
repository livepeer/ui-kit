import { QueryKey, UseQueryOptions, useQuery } from '@tanstack/react-query';
import { HttpError } from 'livepeer/errors';
import { useMemo } from 'react';

import { Status } from './types';

export type InternalQueryError = HttpError | Error;

export const usePickQueryKeys: ReadonlyArray<keyof UseQueryOptions> = [
  'cacheTime',
  'enabled',
  'networkMode',
  'initialData',
  'initialDataUpdatedAt',
  'isDataEqual',
  'keepPreviousData',
  'meta',
  'notifyOnChangeProps',
  'onError',
  'onSettled',
  'onSuccess',
  'placeholderData',
  'refetchInterval',
  'refetchIntervalInBackground',
  'refetchOnMount',
  'refetchOnReconnect',
  'refetchOnWindowFocus',
  'retry',
  'retryOnMount',
  'retryDelay',
  'select',
  'staleTime',
  'structuralSharing',
  'suspense',
  'useErrorBoundary',
] as const;

export type UsePickQueryOptions<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Pick<
  UseQueryOptions<TQueryFnData, InternalQueryError, TData, TQueryKey>,
  typeof usePickQueryKeys[number]
>;

export function useInternalQuery<
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, InternalQueryError, TData, TQueryKey>,
) {
  const {
    data,
    dataUpdatedAt,
    error,
    errorUpdatedAt,
    failureCount,
    isError,
    isFetched,
    isFetchedAfterMount,
    isFetching,
    isPaused,
    isLoadingError,
    isPlaceholderData,
    isPreviousData,
    isRefetchError,
    isRefetching,
    isStale,
    isSuccess,
    refetch,
    remove,
    status: internalStatus,
    fetchStatus,
  } = useQuery<TQueryFnData, HttpError | Error, TData, TQueryKey>(options);

  const status: Status = useMemo(
    () =>
      internalStatus === 'loading' && fetchStatus === 'idle'
        ? 'idle'
        : internalStatus,
    [internalStatus, fetchStatus],
  );

  const isIdle: boolean = useMemo(() => status === 'idle', [status]);
  const isLoading: boolean = useMemo(
    () => status === 'loading' && fetchStatus === 'fetching',
    [status, fetchStatus],
  );

  return {
    data,
    error,
    isError,
    isFetched,
    isFetching,
    isIdle,
    isLoading,
    isRefetching,
    isSuccess,
    refetch,
    status,
    internal: {
      fetchStatus,
      dataUpdatedAt,
      errorUpdatedAt,
      failureCount,
      isFetchedAfterMount,
      isLoadingError,
      isPaused,
      isPlaceholderData,
      isPreviousData,
      isRefetchError,
      isStale: isStale,
      remove,
    },
  } as const;
}
