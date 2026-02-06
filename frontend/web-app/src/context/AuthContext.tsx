"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserInfo,
} from "@/types/generated-api";
import { authService, ApiError } from "@/services/auth";

// Auth state interface
interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth context type
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<UserInfo>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = authService.getStoredUser();
        const storedToken = authService.getStoredToken();
        const storedRefreshToken = authService.getStoredRefreshToken();

        if (storedUser && storedToken) {
          setState({
            user: storedUser,
            accessToken: storedToken,
            refreshToken: storedRefreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        authService.clearStorage();
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<UserInfo> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.login(credentials);

      if (response.success && response.user && response.accessToken) {
        setState({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
        });

        return response.user;
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await authService.register(userData);

      if (response.success) {
        // Registration successful, but user may need to log in separately
        // depending on backend implementation
        setState((prev) => ({ ...prev, isLoading: false }));

        // If backend returns user data with tokens, auto-login
        if (response.user && response.accessToken) {
          setState({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken || null,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        throw new Error(response.message || "Đăng ký thất bại");
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await authService.refreshToken();

      if (response.success && response.accessToken) {
        setState((prev) => ({
          ...prev,
          accessToken: response.accessToken || null,
          refreshToken: response.refreshToken || prev.refreshToken,
        }));
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuthToken: refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
