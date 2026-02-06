"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ReactNode } from "react";

interface MarketerLayoutWrapperProps {
    children: ReactNode;
}

export default function MarketerLayoutWrapper({
    children,
}: MarketerLayoutWrapperProps) {
    return (
        <ProtectedRoute requiredRoles={["MarketingStaff", "Admin"]} fallbackPath="/unauthorized">
            {children}
        </ProtectedRoute>
    );
}