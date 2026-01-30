import { useState, useEffect, useCallback } from 'react';

// Generic API hook interface
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic API hook for handling loading, error states
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Có lỗi xảy ra',
      });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<TData, TVariables = void>() {
  const [state, setState] = useState({
    loading: false,
    error: null as string | null,
    data: null as TData | null,
  });

  const mutate = useCallback(
    async (
      apiCall: (variables: TVariables) => Promise<TData>,
      variables: TVariables
    ) => {
      setState({ loading: true, error: null, data: null });

      try {
        const result = await apiCall(variables);
        setState({ loading: false, error: null, data: result });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
        setState({ loading: false, error: errorMessage, data: null });
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Hook for handling async operations with manual trigger
export function useAsyncOperation<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
}