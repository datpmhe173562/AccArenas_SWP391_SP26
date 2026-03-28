import { axiosInstance } from '@/lib/axios';

export interface AuditLogDto {
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    createdAt: string;
    user: {
        id: string;
        userName: string;
        fullName?: string;
    } | null;
}

export interface AuditLogResponse {
    totalCount: number;
    page: number;
    pageSize: number;
    logs: AuditLogDto[];
}

export const AuditLogService = {
    async getAuditLogs(params: {
        search?: string;
        entityType?: string;
        action?: string;
        role?: string;
        page?: number;
        pageSize?: number;
    }): Promise<AuditLogResponse> {
        const res = await axiosInstance.get<AuditLogResponse>('/api/AuditLogs', {
            params
        });
        return res.data;
    }
};
