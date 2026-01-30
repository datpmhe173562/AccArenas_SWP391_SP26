import { axiosInstance } from '@/lib/axios';
import { 
  UserDto, 
  CreateUserRequest, 
  UpdateUserRequest,
  AssignRoleRequest,
  RemoveRoleRequest
} from '@/types/generated-api';
import { ApiResponse, PaginatedResponse } from '@/types/generated-api';

export const UserService = {
  async getUsers(page = 1, pageSize = 10): Promise<ApiResponse<PaginatedResponse<UserDto>>> {
    const res = await axiosInstance.get<ApiResponse<PaginatedResponse<UserDto>>>('/api/users', {
      params: { page, pageSize }
    });
    return res.data;
  },

  async getAllUsers(): Promise<ApiResponse<UserDto[]>> {
    const res = await axiosInstance.get<ApiResponse<UserDto[]>>('/api/users', {
      params: { pageSize: 1000 }
    });
    return res.data;
  },

  async getUserById(id: string): Promise<ApiResponse<UserDto>> {
    const res = await axiosInstance.get<ApiResponse<UserDto>>(`/api/users/${id}`);
    return res.data;
  },

  async createUser(payload: CreateUserRequest): Promise<ApiResponse<UserDto>> {
    const res = await axiosInstance.post<ApiResponse<UserDto>>('/api/users', payload);
    return res.data;
  },

  async updateUser(id: string, payload: UpdateUserRequest): Promise<ApiResponse<UserDto>> {
    const res = await axiosInstance.put<ApiResponse<UserDto>>(`/api/users/${id}`, payload);
    return res.data;
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const res = await axiosInstance.delete<ApiResponse<void>>(`/api/users/${id}`);
    return res.data;
  },

  async assignRole(payload: AssignRoleRequest): Promise<ApiResponse<void>> {
    const res = await axiosInstance.post<ApiResponse<void>>('/api/users/assign-role', payload);
    return res.data;
  },

  async removeRole(payload: RemoveRoleRequest): Promise<ApiResponse<void>> {
    const res = await axiosInstance.post<ApiResponse<void>>('/api/users/remove-role', payload);
    return res.data;
  },
};