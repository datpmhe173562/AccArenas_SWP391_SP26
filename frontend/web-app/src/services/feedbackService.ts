import { axiosInstance } from '@/lib/axios';
import { ApiResponse } from '@/types/generated-api';

export interface CreateFeedbackRequest {
    orderId: string;
    rating: number;
    comment: string;
}

export const feedbackService = {
    async getFeedbackByOrder(orderId: string): Promise<any[]> {
        const res = await axiosInstance.get<ApiResponse<any[]>>(`/api/feedbacks/order/${orderId}`);
        return res.data.data || [];
    },

    async createFeedback(request: CreateFeedbackRequest): Promise<void> {
        const res = await axiosInstance.post<ApiResponse<any>>('/api/feedbacks', request);
        if (!res.data.success) {
            throw new Error(res.data.message || 'Gửi phản hồi thất bại');
        }
    }
};
