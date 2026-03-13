"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";

interface SalesLayoutWrapperProps {
  children: ReactNode;
}

export default function SalesLayoutWrapper({
  children,
}: SalesLayoutWrapperProps) {
  return (
    <ProtectedRoute requiredRoles={["SalesStaff", "Admin"]}>
      {children}
    </ProtectedRoute>
  );
}
