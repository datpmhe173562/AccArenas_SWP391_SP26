// Promotion Service
import { axiosInstance } from '@/lib/axios';
import {
  PromotionDto,
  CreatePromotionRequest,
  UpdatePromotionRequest,
} from '@/types/generated-api';
import { ApiResponse, PaginatedResponse } from '@/types/generated-api';

export const PromotionService = {
  async getPromotions(page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<PromotionDto>>> {
    const res = await axiosInstance.get<ApiResponse<PaginatedResponse<PromotionDto>>>('/api/promotions', {
      params: { page, pageSize }
    });
    return res.data;
  },

  async getActivePromotions(): Promise<ApiResponse<PromotionDto[]>> {
    const res = await axiosInstance.get<ApiResponse<PromotionDto[]>>('/api/promotions/active');
    return res.data;
  },

  async getPromotionById(id: string): Promise<ApiResponse<PromotionDto>> {
    const res = await axiosInstance.get<ApiResponse<PromotionDto>>(`/api/promotions/${id}`);
    return res.data;
  },

  async createPromotion(request: CreatePromotionRequest): Promise<ApiResponse<PromotionDto>> {
    const res = await axiosInstance.post<ApiResponse<PromotionDto>>('/api/promotions', request);
    return res.data;
  },

  async updatePromotion(id: string, request: UpdatePromotionRequest): Promise<ApiResponse<PromotionDto>> {
    const res = await axiosInstance.put<ApiResponse<PromotionDto>>(`/api/promotions/${id}`, request);
    return res.data;
  },

  async deletePromotion(id: string): Promise<ApiResponse<void>> {
    const res = await axiosInstance.delete<ApiResponse<void>>(`/api/promotions/${id}`);
    return res.data;
  },

  async validatePromotionCode(code: string): Promise<ApiResponse<PromotionDto | null>> {
    try {
      const res = await axiosInstance.get<ApiResponse<PromotionDto>>(`/api/promotions/validate/${code}`);
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: 'Invalid promotion code',
        data: null,
        errors: []
      };
    }
  },
};