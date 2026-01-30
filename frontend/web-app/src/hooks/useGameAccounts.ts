import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gameAccountService } from '@/services/gameAccountService';
import { CreateGameAccountRequest, UpdateGameAccountRequest } from '@/types/generated-api';

// Query keys
const QUERY_KEYS = {
  gameAccounts: 'gameAccounts',
  gameAccount: 'gameAccount',
  gameAccountsByCategory: 'gameAccountsByCategory',
  searchGameAccounts: 'searchGameAccounts',
} as const;

// Get game accounts with pagination
export const useGameAccounts = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.gameAccounts, { page, pageSize }],
    queryFn: () => gameAccountService.getGameAccounts(page, pageSize),
  });
};

// Get game accounts by category
export const useGameAccountsByCategory = (categoryId: string, page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.gameAccountsByCategory, categoryId, { page, pageSize }],
    queryFn: () => gameAccountService.getGameAccountsByCategory(categoryId, page, pageSize),
    enabled: !!categoryId,
  });
};

// Get single game account
export const useGameAccount = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.gameAccount, id],
    queryFn: () => gameAccountService.getGameAccountById(id),
    enabled: enabled && !!id,
  });
};

// Search game accounts
export const useSearchGameAccounts = (
  query?: string,
  categoryId?: string,
  minPrice?: number,
  maxPrice?: number,
  isAvailable?: boolean,
  page = 1,
  pageSize = 10,
  enabled = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.searchGameAccounts, { 
      query, 
      categoryId, 
      minPrice, 
      maxPrice, 
      isAvailable, 
      page, 
      pageSize 
    }],
    queryFn: () => gameAccountService.searchGameAccounts(
      query,
      categoryId,
      minPrice,
      maxPrice,
      isAvailable,
      page,
      pageSize
    ),
    enabled,
  });
};

// Create game account mutation
export const useCreateGameAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateGameAccountRequest) => gameAccountService.createGameAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccounts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccountsByCategory] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchGameAccounts] });
    },
  });
};

// Update game account mutation
export const useUpdateGameAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGameAccountRequest }) => 
      gameAccountService.updateGameAccount(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccounts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccountsByCategory] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchGameAccounts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccount, id] });
    },
  });
};

// Delete game account mutation
export const useDeleteGameAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => gameAccountService.deleteGameAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccounts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.gameAccountsByCategory] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.searchGameAccounts] });
    },
  });
};