import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginRequest, RegisterRequest } from '@/types/generated-api';
import { useMutation, useAsyncOperation } from './useApi';

// Hook for login functionality
export function useLogin() {
  const { login } = useAuth();
  const { loading, error, execute, reset } = useAsyncOperation<void>();

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      return execute(() => login(credentials));
    },
    [execute, login]
  );

  return {
    login: handleLogin,
    loading,
    error,
    reset,
  };
}

// Hook for registration functionality
export function useRegister() {
  const { register } = useAuth();
  const { loading, error, execute, reset } = useAsyncOperation<void>();

  const handleRegister = useCallback(
    async (userData: RegisterRequest) => {
      return execute(() => register(userData));
    },
    [execute, register]
  );

  return {
    register: handleRegister,
    loading,
    error,
    reset,
  };
}

// Hook for logout functionality
export function useLogout() {
  const { logout } = useAuth();
  const { loading, error, execute, reset } = useAsyncOperation<void>();

  const handleLogout = useCallback(
    async () => {
      return execute(() => logout());
    },
    [execute, logout]
  );

  return {
    logout: handleLogout,
    loading,
    error,
    reset,
  };
}

// Combined auth operations hook
export function useAuthOperations() {
  const loginHook = useLogin();
  const registerHook = useRegister();
  const logoutHook = useLogout();

  return {
    login: {
      execute: loginHook.login,
      loading: loginHook.loading,
      error: loginHook.error,
      reset: loginHook.reset,
    },
    register: {
      execute: registerHook.register,
      loading: registerHook.loading,
      error: registerHook.error,
      reset: registerHook.reset,
    },
    logout: {
      execute: logoutHook.logout,
      loading: logoutHook.loading,
      error: logoutHook.error,
      reset: logoutHook.reset,
    },
  };
}