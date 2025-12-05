import { useState, useCallback, useTransition } from 'react';

type MutationState<TData, TError> = {
  readonly data: TData | null;
  readonly error: TError | null;
  readonly isPending: boolean;
};

type MutationResult<TData, TError, TVariables> = MutationState<TData, TError> & {
  readonly mutate: (variables: TVariables) => void;
  readonly reset: () => void;
};

export const useMutation = <TData, TError = Error, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    readonly onSuccess?: (data: TData) => void;
    readonly onError?: (error: TError) => void;
  }
): MutationResult<TData, TError, TVariables> => {
  const [state, setState] = useState<MutationState<TData, TError>>({
    data: null,
    error: null,
    isPending: false,
  });

  const [isPending, startTransition] = useTransition();

  const mutate = useCallback(
    (variables: TVariables) => {
      setState(prev => ({ ...prev, isPending: true, error: null }));

      startTransition(async () => {
        try {
          const data = await mutationFn(variables);
          setState({ data, error: null, isPending: false });
          options?.onSuccess?.(data);
        } catch (error) {
          const typedError = error as TError;
          setState(prev => ({ ...prev, error: typedError, isPending: false }));
          options?.onError?.(typedError);
        }
      });
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isPending: false });
  }, []);

  return {
    ...state,
    isPending: state.isPending || isPending,
    mutate,
    reset,
  };
};
