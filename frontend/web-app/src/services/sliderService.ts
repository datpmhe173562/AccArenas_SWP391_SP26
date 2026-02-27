import { axiosInstance } from '@/lib/axios';
import {
    SliderDto,
    CreateSliderRequest,
    UpdateSliderRequest,
    PagedResult,
} from '@/types/generated-api';

export const sliderService = {
    async getSliders(page = 1, pageSize = 10, isActive?: boolean): Promise<PagedResult<SliderDto>> {
        const params: Record<string, any> = { page, pageSize };
        if (isActive !== undefined) params.isActive = isActive;
        const res = await axiosInstance.get<PagedResult<SliderDto>>('/api/sliders', { params });
        return res.data;
    },

    async getSliderById(id: string): Promise<SliderDto> {
        const res = await axiosInstance.get<SliderDto>(`/api/sliders/${id}`);
        return res.data;
    },

    async getActiveSliders(): Promise<SliderDto[]> {
        const res = await axiosInstance.get<SliderDto[]>('/api/sliders/active');
        return res.data;
    },

    async createSlider(payload: CreateSliderRequest): Promise<SliderDto> {
        const res = await axiosInstance.post<SliderDto>('/api/sliders', payload);
        return res.data;
    },

    async updateSlider(id: string, payload: UpdateSliderRequest): Promise<void> {
        await axiosInstance.put(`/api/sliders/${id}`, payload);
    },

    async deleteSlider(id: string): Promise<void> {
        await axiosInstance.delete(`/api/sliders/${id}`);
    },

    async toggleSliderStatus(id: string): Promise<{ isActive: boolean }> {
        const res = await axiosInstance.patch<{ isActive: boolean }>(`/api/sliders/${id}/toggle-status`);
        return res.data;
    },
};
