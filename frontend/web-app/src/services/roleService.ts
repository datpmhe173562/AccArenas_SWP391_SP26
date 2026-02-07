import { axiosInstance } from '@/lib/axios';
import { RoleDto, ApiResponse } from '@/types/generated-api';

export const RoleService = {
    async getAllRoles(): Promise<RoleDto[]> {
        const res = await axiosInstance.get<any>('/api/roles', {
            params: { pageSize: 1000 }
        });
        return res.data.items || [];
    },

    async getRoles(page = 1, pageSize = 10): Promise<any> {
        const res = await axiosInstance.get<any>('/api/roles', {
            params: { page, pageSize }
        });
        return res.data;
    },

    async getRoleById(id: string): Promise<ApiResponse<RoleDto>> {
        const res = await axiosInstance.get<ApiResponse<RoleDto>>(`/api/roles/${id}`);
        return res.data;
    },

    async createRole(payload: any): Promise<ApiResponse<RoleDto>> {
        const res = await axiosInstance.post<ApiResponse<RoleDto>>('/api/roles', payload);
        return res.data;
    },

    async updateRole(id: string, payload: any): Promise<ApiResponse<void>> {
        const res = await axiosInstance.put<ApiResponse<void>>(`/api/roles/${id}`, payload);
        return res.data;
    },

    async deleteRole(id: string): Promise<ApiResponse<void>> {
        const res = await axiosInstance.delete<ApiResponse<void>>(`/api/roles/${id}`);
        return res.data;
    }
};
