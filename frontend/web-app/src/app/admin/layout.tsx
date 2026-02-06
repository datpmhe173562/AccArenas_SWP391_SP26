"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["Admin"]}>
      {children}
    </ProtectedRoute>
  );
}
