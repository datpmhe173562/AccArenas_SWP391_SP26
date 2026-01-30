import { useCallback, useMemo } from 'react';
import { UserDto, CreateUserRequest, UpdateUserRequest } from '@/types/generated-api';
import { useApi, useMutation } from './useApi';
import { UserService } from '../services/userService';

// Hook to get users with pagination
export function useUsers(page = 1, pageSize = 10) {
  const apiCall = useCallback(async () => {
    const response = await UserService.getUsers(page, pageSize);
    if (!response.data) {
      throw new Error(response.message || 'Failed to fetch users');
    }
    return response.data;
  }, [page, pageSize]);
  
  return useApi(apiCall, [page, pageSize]);
}

// Hook to get single user by ID
export function useUser(id: string) {
  const apiCall = useCallback(async () => {
    const response = await UserService.getUserById(id);
    if (!response.data) {
      throw new Error(response.message || 'Failed to fetch user');
    }
    return response.data;
  }, [id]);
  
  return useApi(apiCall, [id]);
}

// Hook for user mutations
export function useUserMutations() {
  const createMutation = useMutation<UserDto, CreateUserRequest>();
  const updateMutation = useMutation<UserDto, { id: string; data: UpdateUserRequest }>();
  const deleteMutation = useMutation<void, string>();

  const createUser = useCallback(
    async (data: CreateUserRequest) => {
      return createMutation.mutate(
        async (payload) => {
          const response = await UserService.createUser(payload);
          if (!response.data) {
            throw new Error(response.message || 'Failed to create user');
          }
          return response.data;
        },
        data
      );
    },
    [createMutation.mutate]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserRequest) => {
      return updateMutation.mutate(
        async ({ id, data }) => {
          const response = await UserService.updateUser(id, data);
          if (!response.data) {
            throw new Error(response.message || 'Failed to update user');
          }
          return response.data;
        },
        { id, data }
      );
    },
    [updateMutation.mutate]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      return deleteMutation.mutate(
        async (userId) => {
          const response = await UserService.deleteUser(userId);
          // For delete operations, data might be void/null, so just return undefined
          return response.data || undefined;
        },
        id
      );
    },
    [deleteMutation.mutate]
  );

  const isLoading = useMemo(() => 
    createMutation.loading || updateMutation.loading || deleteMutation.loading,
    [createMutation.loading, updateMutation.loading, deleteMutation.loading]
  );

  const error = useMemo(() => 
    createMutation.error || updateMutation.error || deleteMutation.error,
    [createMutation.error, updateMutation.error, deleteMutation.error]
  );

  const reset = useCallback(() => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
  }, [createMutation.reset, updateMutation.reset, deleteMutation.reset]);

  return {
    createUser,
    updateUser,
    deleteUser,
    loading: isLoading,
    error,
    reset,
    operations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    },
  };
}

// Combined users hook
export function useUsersData() {
  const usersQuery = useUsers();
  const mutations = useUserMutations();

  const refetchUsers = useCallback(async () => {
    await usersQuery.refetch();
  }, [usersQuery.refetch]);

  return {
    users: usersQuery.data || { data: [], totalCount: 0, totalPages: 0, page: 1, pageSize: 10, hasNext: false, hasPrevious: false },
    loading: usersQuery.loading,
    error: usersQuery.error,
    refetch: refetchUsers,
    mutations,
  };
}