import { axiosInstance } from '@/lib/axios';
import {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '@/types/generated-api';
import { ApiResponse, PaginatedResponse, PagedResult } from '@/types/generated-api';

export const categoryService = {
  async getCategories(page = 1, pageSize = 10): Promise<PagedResult<CategoryDto>> {
    const res = await axiosInstance.get<PagedResult<CategoryDto>>('/api/categories', {
      params: { page, pageSize }
    });
    return res.data;
  },

  async getAllCategories(): Promise<ApiResponse<CategoryDto[]>> {
    const res = await axiosInstance.get<ApiResponse<CategoryDto[]>>('/api/categories', {
      params: { pageSize: 1000 }
    });
    return res.data;
  },

  async getCategoryById(id: string): Promise<CategoryDto> {
    const res = await axiosInstance.get<CategoryDto>(`/api/categories/${id}`);
    return res.data;
  },

  async createCategory(payload: CreateCategoryRequest): Promise<ApiResponse<CategoryDto>> {
    const res = await axiosInstance.post<ApiResponse<CategoryDto>>('/api/categories', payload);
    return res.data;
  },

  async updateCategory(id: string, payload: UpdateCategoryRequest): Promise<ApiResponse<CategoryDto>> {
    const res = await axiosInstance.put<ApiResponse<CategoryDto>>(`/api/categories/${id}`, payload);
    return res.data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    const res = await axiosInstance.delete<ApiResponse<void>>(`/api/categories/${id}`);
    return res.data;
  },
};