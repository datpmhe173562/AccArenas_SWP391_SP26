import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/generated-api";
import { InquiryDto, FulfillmentEventDto, SalesOrder } from "@/types/sales";

interface UpdateOrderStatusRequest {
    status: string;
    reason?: string;
}

export const salesService = {
    async getAssignedOrders(): Promise<SalesOrder[]> {
        const res = await axiosInstance.get<ApiResponse<SalesOrder[]>>("/api/sales/orders");
        return res.data.data || [];
    },

    async updateOrderStatus(id: string, status: string, reason?: string): Promise<SalesOrder> {
        const payload: UpdateOrderStatusRequest = { status, reason };
        const res = await axiosInstance.patch<ApiResponse<SalesOrder>>(`/api/sales/orders/${id}/status`, payload);
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Không thể cập nhật trạng thái");
        }
        return res.data.data;
    },

    async addFulfillmentNote(id: string, note: string): Promise<FulfillmentEventDto[]> {
        const res = await axiosInstance.post<ApiResponse<FulfillmentEventDto[]>>(`/api/sales/orders/${id}/note`, { note });
        return res.data.data || [];
    },

    async getTimeline(id: string): Promise<FulfillmentEventDto[]> {
        const res = await axiosInstance.get<ApiResponse<FulfillmentEventDto[]>>(`/api/sales/orders/${id}/timeline`);
        return res.data.data || [];
    },

    async getStats(): Promise<any> {
        const res = await axiosInstance.get<ApiResponse<any>>("/api/sales/stats/me");
        return res.data.data;
    },

    async getInquiries(): Promise<InquiryDto[]> {
        const res = await axiosInstance.get<ApiResponse<InquiryDto[]>>("/api/sales/inquiries");
        return res.data.data || [];
    },

    async getInquiry(id: string): Promise<InquiryDto> {
        const res = await axiosInstance.get<ApiResponse<InquiryDto>>(`/api/sales/inquiries/${id}`);
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Không tìm thấy yêu cầu");
        }
        return res.data.data;
    },

    async replyInquiry(id: string, message: string): Promise<InquiryDto> {
        const res = await axiosInstance.post<ApiResponse<InquiryDto>>(`/api/sales/inquiries/${id}/reply`, { message });
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Không thể gửi phản hồi");
        }
        return res.data.data;
    },
};
