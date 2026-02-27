import { axiosInstance } from '@/lib/axios';
import {
    BannerDto,
    CreateBannerRequest,
    UpdateBannerRequest,
    PagedResult,
} from '@/types/generated-api';

export const bannerService = {
    async getBanners(page = 1, pageSize = 10, isActive?: boolean): Promise<PagedResult<BannerDto>> {
        const params: Record<string, any> = { page, pageSize };
        if (isActive !== undefined) params.isActive = isActive;
        const res = await axiosInstance.get<PagedResult<BannerDto>>('/api/banners', { params });
        return res.data;
    },

    async getBannerById(id: string): Promise<BannerDto> {
        const res = await axiosInstance.get<BannerDto>(`/api/banners/${id}`);
        return res.data;
    },

    async getActiveBanners(): Promise<BannerDto[]> {
        const res = await axiosInstance.get<BannerDto[]>('/api/banners/active');
        return res.data;
    },

    async createBanner(payload: CreateBannerRequest): Promise<BannerDto> {
        const res = await axiosInstance.post<BannerDto>('/api/banners', payload);
        return res.data;
    },

    async updateBanner(id: string, payload: UpdateBannerRequest): Promise<void> {
        await axiosInstance.put(`/api/banners/${id}`, payload);
    },

    async deleteBanner(id: string): Promise<void> {
        await axiosInstance.delete(`/api/banners/${id}`);
    },

    async toggleBannerStatus(id: string): Promise<{ isActive: boolean }> {
        const res = await axiosInstance.patch<{ isActive: boolean }>(`/api/banners/${id}/toggle-status`);
        return res.data;
    },
};
