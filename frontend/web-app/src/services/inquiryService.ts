import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/generated-api";
import { InquiryDto } from "@/types/sales";

export const inquiryService = {
    async getMyInquiries(): Promise<InquiryDto[]> {
        const res = await axiosInstance.get<ApiResponse<InquiryDto[]>>("/api/inquiries/my");
        return res.data.data || [];
    },

    async getInquiriesByOrder(orderId: string): Promise<InquiryDto[]> {
        const res = await axiosInstance.get<ApiResponse<InquiryDto[]>>(`/api/inquiries/order/${orderId}`);
        return res.data.data || [];
    },

    async getInquiryDetail(id: string): Promise<InquiryDto> {
        const res = await axiosInstance.get<ApiResponse<InquiryDto>>(`/api/inquiries/${id}`);
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Không tìm thấy yêu cầu hỗ trợ");
        }
        return res.data.data;
    },

    async createInquiry(orderId: string, subject: string, message: string): Promise<InquiryDto> {
        const res = await axiosInstance.post<ApiResponse<InquiryDto>>("/api/inquiries", { orderId, subject, message });
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Không thể gửi yêu cầu hỗ trợ");
        }
        return res.data.data;
    },

    async replyInquiry(id: string, message: string): Promise<InquiryDto> {
        const res = await axiosInstance.post<ApiResponse<InquiryDto>>(`/api/inquiries/${id}/reply`, { message });
        if (!res.data.success || !res.data.data) {
            throw new Error(res.data.message || "Không thể gửi phản hồi");
        }
        return res.data.data;
    }
};
