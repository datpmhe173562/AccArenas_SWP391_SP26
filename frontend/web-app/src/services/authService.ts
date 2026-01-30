import { axiosInstance } from '@/lib/axios';
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest,
  RefreshTokenRequest,
  ChangePasswordRequest 
} from '@/types/generated-api';
import { ApiResponse } from '@/types/generated-api';

export const authService = {
  async login(payload: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/login', payload);
    
    // Store tokens if successful
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      if (authData.accessToken) {
        localStorage.setItem('access_token', authData.accessToken);
      }
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }
      if (authData.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    }
    
    return res.data;
  },

  async register(payload: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/register', payload);
    
    // Store tokens if successful and auto-login
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      if (authData.accessToken) {
        localStorage.setItem('access_token', authData.accessToken);
      }
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }
      if (authData.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
      }
    }
    
    return res.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const res = await axiosInstance.post<ApiResponse<void>>('/api/auth/logout');
    
    // Clear storage regardless of API response
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    return res.data;
  },

  async refreshToken(payload: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await axiosInstance.post<ApiResponse<AuthResponse>>('/api/auth/refresh', payload);
    
    // Update tokens if successful
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      if (authData.accessToken) {
        localStorage.setItem('access_token', authData.accessToken);
      }
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }
    }
    
    return res.data;
  },

  async changePassword(payload: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const res = await axiosInstance.post<ApiResponse<void>>('/api/auth/change-password', payload);
    return res.data;
  },

  // Helper methods
  getStoredUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  getStoredToken() {
    return localStorage.getItem('access_token');
  },

  getStoredRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};