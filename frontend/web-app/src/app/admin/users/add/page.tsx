"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/users";
import { UserService } from "@/services/userService";

export default function AddUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    fullName: string;
    email: string;
    userName: string;
    password?: string;
  }) => {
    setIsLoading(true);
    console.log("[AddUser] Starting user creation with data:", {
      ...data,
      password: data.password ? "***" : undefined,
    });

    try {
      const createUserPayload = {
        userName: data.userName,
        email: data.email,
        fullName: data.fullName,
        password: data.password || "",
        isActive: true,
        roles: [] as string[], // Default to no roles, can be modified later
      };

      console.log("[AddUser] Calling API with payload:", {
        ...createUserPayload,
        password: "***",
      });

      const response = await UserService.createUser(createUserPayload);

      console.log("[AddUser] User created successfully:", response);

      // Navigate back to users list
      router.push("/admin/users");
    } catch (error: any) {
      console.error("[AddUser] Error creating user:", error);
      console.error("[AddUser] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Show error to user
      alert(
        `Lỗi khi tạo người dùng: ${
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/users");
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại danh sách người dùng
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Thêm người dùng mới
          </h1>
        </div>

        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitButtonText="Thêm người dùng"
          title="Thông tin người dùng mới"
          isCreating={true}
        />
      </div>
    </AdminLayout>
  );
}
