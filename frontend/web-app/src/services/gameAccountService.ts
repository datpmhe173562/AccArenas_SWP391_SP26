import { axiosInstance } from '@/lib/axios';
import { 
  GameAccountDto, 
  CreateGameAccountRequest, 
  UpdateGameAccountRequest 
} from '@/types/generated-api';
import { ApiResponse, PaginatedResponse } from '@/types/generated-api';

export const gameAccountService = {
  async getGameAccounts(page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<GameAccountDto>>> {
    const res = await axiosInstance.get<ApiResponse<PaginatedResponse<GameAccountDto>>>('/api/gameaccounts', {
      params: { page, pageSize }
    });
    return res.data;
  },

  async getGameAccountsByCategory(categoryId: string, page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<GameAccountDto>>> {
    const res = await axiosInstance.get<ApiResponse<PaginatedResponse<GameAccountDto>>>(`/api/gameaccounts/category/${categoryId}`, {
      params: { page, pageSize }
    });
    return res.data;
  },

  async getGameAccountById(id: string): Promise<ApiResponse<GameAccountDto>> {
    const res = await axiosInstance.get<ApiResponse<GameAccountDto>>(`/api/gameaccounts/${id}`);
    return res.data;
  },

  async searchGameAccounts(
    query?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    isAvailable?: boolean,
    page = 1,
    pageSize = 10
  ): Promise<ApiResponse<PaginatedResponse<GameAccountDto>>> {
    const params: any = { page, pageSize };
    if (query) params.search = query;
    if (categoryId) params.categoryId = categoryId;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (isAvailable !== undefined) params.isAvailable = isAvailable;

    const res = await axiosInstance.get<ApiResponse<PaginatedResponse<GameAccountDto>>>('/api/gameaccounts', { params });
    return res.data;
  },

  async createGameAccount(payload: CreateGameAccountRequest): Promise<ApiResponse<GameAccountDto>> {
    const res = await axiosInstance.post<ApiResponse<GameAccountDto>>('/api/gameaccounts', payload);
    return res.data;
  },

  async updateGameAccount(id: string, payload: UpdateGameAccountRequest): Promise<ApiResponse<GameAccountDto>> {
    const res = await axiosInstance.put<ApiResponse<GameAccountDto>>(`/api/gameaccounts/${id}`, payload);
    return res.data;
  },

  async deleteGameAccount(id: string): Promise<ApiResponse<void>> {
    const res = await axiosInstance.delete<ApiResponse<void>>(`/api/gameaccounts/${id}`);
    return res.data;
  },
};