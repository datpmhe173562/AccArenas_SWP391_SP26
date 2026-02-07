import { axiosInstance } from '@/lib/axios';
import {
    PromotionDto,
    CreatePromotionRequest,
    UpdatePromotionRequest,
    PromotionQueryRequest,
    PagedResult,
    ApiResponse
} from '@/types/generated-api';

export const promotionService = {
    async getPromotions(query: PromotionQueryRequest): Promise<PagedResult<PromotionDto>> {
        const res = await axiosInstance.get<any>('/api/promotions', {
            params: query
        });
        // Adjust response structure based on backend
        return res.data.data ? {
            items: res.data.data,
            ...res.data.pagination,
            pageNumber: res.data.pagination.page,
            totalPages: res.data.pagination.totalPages,
            totalCount: res.data.pagination.totalCount
        } : res.data;
    },

    async getPromotionById(id: string): Promise<PromotionDto> {
        const res = await axiosInstance.get<PromotionDto>(`/api/promotions/${id}`);
        return res.data;
    },

    async createPromotion(payload: CreatePromotionRequest): Promise<PromotionDto> {
        const res = await axiosInstance.post<PromotionDto>('/api/promotions', payload);
        return res.data;
    },

    async updatePromotion(id: string, payload: UpdatePromotionRequest): Promise<PromotionDto> {
        const res = await axiosInstance.put<PromotionDto>(`/api/promotions/${id}`, payload);
        return res.data;
    },

    async deletePromotion(id: string): Promise<void> {
        await axiosInstance.delete(`/api/promotions/${id}`);
    },

    async toggleStatus(id: string): Promise<PromotionDto> {
        const res = await axiosInstance.patch<PromotionDto>(`/api/promotions/${id}/toggle-status`);
        return res.data;
    }
};
