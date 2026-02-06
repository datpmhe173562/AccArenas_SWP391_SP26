"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";

export default function MarketerRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute requiredRoles={["MarketingStaff", "Admin"]}>
      {children}
    </ProtectedRoute>
  );
}
