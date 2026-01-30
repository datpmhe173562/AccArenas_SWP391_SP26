"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

// Component for routes that should only be accessible when NOT authenticated
// (like login, register pages)
export default function PublicRoute({
  children,
  redirectTo = "/",
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Don't render anything if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
