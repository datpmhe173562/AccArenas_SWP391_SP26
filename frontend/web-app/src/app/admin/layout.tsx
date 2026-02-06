"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";

interface AdminLayoutWrapperProps {
    children: ReactNode;
}

export default function AdminLayoutWrapper({
    children,
}: AdminLayoutWrapperProps) {
    return (
        <ProtectedRoute requiredRoles={["Admin"]} fallbackPath="/unauthorized">
            {children}
        </ProtectedRoute>
    );
}
