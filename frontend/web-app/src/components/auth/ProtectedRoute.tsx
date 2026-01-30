"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  fallbackPath = "/auth/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      // Check if user has required roles
      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some((role) =>
          user.roles.includes(role),
        );

        if (!hasRequiredRole) {
          router.push("/unauthorized");
          return;
        }
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRoles, router, fallbackPath]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if user doesn't have required roles (will redirect)
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options?: {
    requiredRoles?: string[];
    fallbackPath?: string;
  },
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute
        requiredRoles={options?.requiredRoles}
        fallbackPath={options?.fallbackPath}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
