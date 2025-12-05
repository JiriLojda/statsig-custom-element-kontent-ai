import { useState, useEffect, useCallback } from 'react';

type AsyncState<T> =
  | { readonly status: 'idle'; readonly data: null; readonly error: null }
  | { readonly status: 'loading'; readonly data: null; readonly error: null }
  | { readonly status: 'success'; readonly data: T; readonly error: null }
  | { readonly status: 'error'; readonly data: null; readonly error: Error };

type UseAsyncResult<T> = AsyncState<T> & {
  readonly isLoading: boolean;
  readonly refetch: () => void;
};

export const useAsync = <T>(
  asyncFn: () => Promise<T>,
  deps: readonly unknown[]
): UseAsyncResult<T> => {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const [fetchCount, setFetchCount] = useState(0);

  const execute = useCallback(() => {
    setState({ status: 'loading', data: null, error: null });

    asyncFn()
      .then(data => setState({ status: 'success', data, error: null }))
      .catch(error => setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
  }, deps);

  useEffect(() => {
    execute();
  }, [execute, fetchCount]);

  const refetch = useCallback(() => {
    setFetchCount(c => c + 1);
  }, []);

  return {
    ...state,
    isLoading: state.status === 'loading',
    refetch,
  };
};

export const useAsyncConditional = <T>(
  asyncFn: (() => Promise<T>) | null,
  deps: readonly unknown[]
): UseAsyncResult<T | null> => {
  const [state, setState] = useState<AsyncState<T | null>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const [fetchCount, setFetchCount] = useState(0);

  useEffect(() => {
    if (!asyncFn) {
      setState({ status: 'idle', data: null, error: null });
      return;
    }

    setState({ status: 'loading', data: null, error: null });

    asyncFn()
      .then(data => setState({ status: 'success', data, error: null }))
      .catch(error => setState({
        status: 'error',
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
  }, [...deps, fetchCount, asyncFn !== null]);

  const refetch = useCallback(() => {
    setFetchCount(c => c + 1);
  }, []);

  return {
    ...state,
    isLoading: state.status === 'loading',
    refetch,
  };
};
