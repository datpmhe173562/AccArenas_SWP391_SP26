import { axiosInstance } from '@/lib/axios';
import {
  GameAccountDto,
  CreateGameAccountRequest,
  UpdateGameAccountRequest,
  PagedResult
} from '@/types/generated-api';

export const gameAccountService = {
  async getGameAccounts(pageNumber = 1, pageSize = 10): Promise<PagedResult<GameAccountDto>> {
    const res = await axiosInstance.get<PagedResult<GameAccountDto>>('/api/gameaccounts', {
      params: { pageNumber, pageSize }
    });
    return res.data;
  },

  async getGameAccountsByCategory(categoryId: string, pageNumber = 1, pageSize = 10): Promise<GameAccountDto[]> {
    const res = await axiosInstance.get<GameAccountDto[]>(`/api/gameaccounts/category/${categoryId}`, {
      params: { pageNumber, pageSize }
    });
    return res.data;
  },

  async getGameAccountById(id: string): Promise<GameAccountDto> {
    const res = await axiosInstance.get<GameAccountDto>(`/api/gameaccounts/${id}`);
    return res.data;
  },

  async searchGameAccounts(
    query?: string,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    isAvailable?: boolean,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PagedResult<GameAccountDto>> {
    const params: any = { pageNumber, pageSize };
    if (query) params.query = query;
    if (categoryId) params.categoryId = categoryId;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    if (isAvailable !== undefined) params.isAvailable = isAvailable;

    const res = await axiosInstance.get<PagedResult<GameAccountDto>>('/api/gameaccounts', { params });
    return res.data;
  },

  async createGameAccount(payload: CreateGameAccountRequest): Promise<GameAccountDto> {
    const res = await axiosInstance.post<GameAccountDto>('/api/gameaccounts', payload);
    return res.data;
  },

  async updateGameAccount(id: string, payload: UpdateGameAccountRequest): Promise<void> {
    await axiosInstance.put(`/api/gameaccounts/${id}`, payload);
  },

  async deleteGameAccount(id: string): Promise<void> {
    await axiosInstance.delete(`/api/gameaccounts/${id}`);
  },
};