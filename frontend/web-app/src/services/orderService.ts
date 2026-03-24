import { axiosInstance } from '@/lib/axios';
import { ApiResponse, OrderDto } from '@/types/generated-api';

export interface CreateOrderRequest {
    gameAccountIds: string[];
    promotionCode?: string;
}

export const orderService = {
    async createPayment(request: CreateOrderRequest): Promise<{ orderId: string, paymentUrl: string }> {
        const res = await axiosInstance.post<ApiResponse<{ orderId: string, paymentUrl: string }>>('/api/orders/create-payment', request);
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || 'Không thể tạo thanh toán');
        }
        return res.data.data;
    },

    async cancelOrder(id: string): Promise<void> {
        await axiosInstance.post(`/api/orders/cancel/${id}`);
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
