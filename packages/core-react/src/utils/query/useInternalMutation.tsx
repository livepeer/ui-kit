import { HttpError, pick } from '@livepeer/core';
import {
  MutationFunction,
  UseMutationOptions,
  useMutation,
} from '@tanstack/react-query';

import { useMemo } from 'react';

import { QueryClientContext } from '../../context';

export const useInternalMutationKeys = [
  'cacheTime',
  'networkMode',
  'onError',
  'onMutate',
  'onSettled',
  'onSuccess',
  'retry',
  'retryDelay',
  'useErrorBoundary',
  'meta',
] as const;

export type UseInternalMutationOptions<
  TData,
  TVariables,
  TError = HttpError | Error,
  TContext = unknown,
> =
  | (TVariables & {
      mutationConfig?: Partial<
        Pick<
          UseMutationOptions<TData, TError, TVariables, TContext>,
          typeof useInternalMutationKeys[number]
        >
      >;
    })
  | undefined
  | null;

export function useInternalMutation<
  TData,
  TVariables,
  TError = HttpError | Error,
  TContext = unknown,
>(
  options:
    | UseInternalMutationOptions<TData, TVariables, TError, TContext>
    | undefined
    | null,
  mutationFn: MutationFunction<TData, TVariables>,
  mutationKey: UseMutationOptions<
    TData,
    TVariables,
    TError,
    TContext
  >['mutationKey'],
) {
  const {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    reset,
    variables,
    status,
  } = useMutation<TData, TError, TVariables, TContext>(mutationFn, {
    context: QueryClientContext,
    mutationKey: mutationKey,
    ...(typeof options?.mutationConfig === 'object'
      ? pick(options.mutationConfig, ...useInternalMutationKeys)
      : {}),
    useErrorBoundary: false,
  });

  return useMemo(
    () =>
      ({
        data,
        error,
        isError,
        isIdle,
        isLoading,
        isSuccess,
        mutate: options
          ? () => mutate({ ...options, config: undefined })
          : undefined,
        mutateAsync: () =>
          options ? mutateAsync({ ...options, config: undefined }) : undefined,
        variables,
        status,
        internal: {
          reset,
        },
      } as const),
    [
      data,
      error,
      isError,
      isIdle,
      isLoading,
      isSuccess,
      mutate,
      mutateAsync,
      reset,
      variables,
      status,
      options,
    ],
  );
}
