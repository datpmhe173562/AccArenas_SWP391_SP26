// Auth types dựa trên backend DTOs

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName?: string;
  phoneNumber?: string;
}

export interface UserInfo {
  id: string;
  userName: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  roles: string[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  user?: UserInfo;
  errors?: string[];
}

export interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType {
  ...AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}