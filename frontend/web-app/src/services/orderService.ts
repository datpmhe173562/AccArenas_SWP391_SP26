import { axiosInstance } from '@/lib/axios';
import { ApiResponse, OrderDto } from '@/types/generated-api';

export interface CreateOrderRequest {
    gameAccountIds: string[];
}

export const orderService = {
    async createPayment(request: CreateOrderRequest): Promise<string> {
        const res = await axiosInstance.post<ApiResponse<string>>('/api/orders/create-payment', request);
        return res.data.data || ''; // This is the VNPay URL
    },

    async getMyOrders(): Promise<OrderDto[]> {
        const res = await axiosInstance.get<ApiResponse<OrderDto[]>>('/api/orders/my-orders');
        return res.data.data || [];
    },

    async getOrderById(id: string): Promise<OrderDto> {
        const res = await axiosInstance.get<ApiResponse<OrderDto>>(`/api/orders/${id}`);
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || 'Không tìm thấy đơn hàng');
        }
        return res.data.data;
    }
};
