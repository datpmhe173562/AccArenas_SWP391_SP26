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
  async getUsers(page = 1, pageSize = 10, search = ''): Promise<any> {
    const res = await axiosInstance.get<any>('/api/users', {
      params: { page, pageSize, search }
    });
    return res.data;
  },

  async getAllUsers(): Promise<UserDto[]> {
    const res = await axiosInstance.get<any>('/api/users', {
      params: { pageSize: 1000 }
    });
    return res.data.items || [];
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

  async assignRole(payload: AssignRoleRequest): Promise<any> {
    const res = await axiosInstance.post(`/api/users/${payload.userId}/roles`, payload);
    return { success: true, message: res.data };
  },

  async removeRole(payload: RemoveRoleRequest): Promise<any> {
    await axiosInstance.delete(`/api/users/${payload.userId}/roles`, {
      data: payload
    });
    return { success: true };
  },
};