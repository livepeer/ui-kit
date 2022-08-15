import {
  MutationFunction,
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query';
import { HttpError } from 'livepeer';

export type UseInternalMutationOptions<
  TData = unknown,
  TError = HttpError | Error,
  TVariables = void,
  TContext = unknown,
> = UseMutationOptions<TData, TError, TVariables, TContext>;

export function useInternalMutation<
  TData = unknown,
  TError = HttpError | Error,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseInternalMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >,
): Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  'reset' | 'context' | 'failureCount' | 'isPaused'
> & {
  internal: Pick<
    UseMutationResult<TData, TError, TVariables, TContext>,
    'reset'
  >;
} {
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
    ...options,
    useErrorBoundary: false,
  });

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    mutate,
    mutateAsync,
    variables,
    status,
    internal: {
      reset,
    },
  } as const;
}
