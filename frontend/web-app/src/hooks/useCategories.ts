import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '@/types/generated-api';

// Query keys
const QUERY_KEYS = {
  categories: 'categories',
  category: 'category',
} as const;

// Get categories with pagination
export const useCategories = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.categories, { page, pageSize }],
    queryFn: () => categoryService.getCategories(page, pageSize),
  });
};

// Get all categories (without pagination)
export const useAllCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.categories, 'all'],
    queryFn: () => categoryService.getAllCategories(),
  });
};

// Get category by ID
export const useCategory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.category, id],
    queryFn: () => categoryService.getCategoryById(id),
    enabled: enabled && !!id,
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryRequest) => categoryService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryRequest }) =>
      categoryService.updateCategory(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.category, id] });
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.categories] });
    },
  });
};