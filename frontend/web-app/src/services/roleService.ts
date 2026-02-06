import { axiosInstance } from '@/lib/axios';
import { RoleDto, ApiResponse } from '@/types/generated-api';

export const RoleService = {
    async getAllRoles(): Promise<RoleDto[]> {
        const res = await axiosInstance.get<any>('/api/roles', {
            params: { pageSize: 1000 }
        });
        return res.data.items || [];
    },

    async getRoles(page = 1, pageSize = 10): Promise<ApiResponse<any>> {
        const res = await axiosInstance.get<ApiResponse<any>>('/api/roles', {
            params: { page, pageSize }
        });
        return res.data;
    }
};
