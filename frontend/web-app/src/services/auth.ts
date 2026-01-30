import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7171/api';

class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
  }
}

class AuthService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      let errorMessage = 'Có lỗi xảy ra';
      let errors: Record<string, string> = {};
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        errors = errorData.errors || {};
      } catch (e) {
        // If response is not JSON, use default message
      }
      
      throw new ApiError(response.status, errorMessage, errors);
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens if login successful
    if (response.success && response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } finally {
      // Clear storage regardless of API response
      this.clearStorage();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update tokens
    if (response.success && response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
    }

    return response;
  }

  clearStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getStoredUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }
}

export const authService = new AuthService();
export { ApiError };