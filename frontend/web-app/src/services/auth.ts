import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/generated-api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5089/api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
  }
}

// Token management utilities
export class TokenManager {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }
}

class AuthService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    let baseUrl = API_BASE_URL;
    if (!baseUrl.endsWith('/api') && !baseUrl.includes('/api/')) {
      baseUrl = `${baseUrl}/api`;
    }
    const url = `${baseUrl}${endpoint}`;
    console.log('Sending request to:', url);
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = TokenManager.getAccessToken();
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
      TokenManager.setAccessToken(response.accessToken);
      if (response.refreshToken) {
        TokenManager.setRefreshToken(response.refreshToken);
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

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Clear storage regardless of API response
      this.clearStorage();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update tokens
    if (response.success && response.accessToken) {
      TokenManager.setAccessToken(response.accessToken);
      if (response.refreshToken) {
        TokenManager.setRefreshToken(response.refreshToken);
      }
    }

    return response;
  }

  clearStorage(): void {
    TokenManager.clearTokens();
    localStorage.removeItem('user');
  }

  getStoredUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getStoredToken(): string | null {
    return TokenManager.getAccessToken();
  }

  getStoredRefreshToken(): string | null {
    return TokenManager.getRefreshToken();
  }
}

export const authService = new AuthService();