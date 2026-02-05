"use client";

import { useState, useEffect, Suspense } from "react";
import { UserService } from "@/services/userService";
import { UserDto } from "@/types/generated-api";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/users";

function UpdateUserContent() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      router.push("/admin/users");
    }
  }, [userId]);

  const fetchUser = async () => {
    console.log("[UpdateUser] Fetching user with ID:", userId);
    try {
      setLoading(true);
      
      const response = await UserService.getUserById(userId!);
      console.log("[UpdateUser] Raw API response:", response);

      // Handle different response structures
      let userData: UserDto | null = null;
      
      if (response && typeof response === 'object') {
        // Check if response has a data property
        if ('data' in response && response.data) {
          userData = response.data as UserDto;
        } 
        // Check if response has success property
        else if ('success' in response && response.success && 'data' in response) {
          userData = response.data as UserDto;
        }
        // Response might be the user object directly
        else if ('id' in response && 'userName' in response) {
          userData = response as unknown as UserDto;
        }
      }

      console.log("[UpdateUser] Parsed user data:", userData);

      if (userData) {
        setUser(userData);
      } else {
        console.error("[UpdateUser] User not found in response");
        alert("Không tìm thấy người dùng");
        router.push("/admin/users");
      }
    } catch (error: any) {
      console.error("[UpdateUser] Failed to fetch user:", error);
      console.error("[UpdateUser] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(`Lỗi khi tải thông tin người dùng: ${error.message}`);
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    fullName: string;
    email: string;
    userName: string;
    password?: string;
  }) => {
    if (!user) return;

    setIsSubmitting(true);
    console.log("[UpdateUser] Starting user update for ID:", user.id);
    console.log("[UpdateUser] Update data:", {
      ...data,
      password: data.password ? "***" : undefined,
    });

    try {
      const updatePayload: any = {
        userName: data.userName,
        email: data.email,
        fullName: data.fullName,
        isActive: user.isActive,
      };

      // Only include password if provided
      if (data.password && data.password.trim()) {
        updatePayload.password = data.password;
        console.log("[UpdateUser] Password will be updated");
      }

      console.log("[UpdateUser] Calling API with payload:", {
        ...updatePayload,
        password: updatePayload.password ? "***" : undefined,
      });

      await UserService.updateUser(user.id!, updatePayload);

      console.log("[UpdateUser] User updated successfully");

      // Navigate back to users list
      router.push("/admin/users");
    } catch (error: any) {
      console.error("[UpdateUser] Error updating user:", error);
      console.error("[UpdateUser] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Show error to user
      alert(
        `Lỗi khi cập nhật người dùng: ${
          error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/users");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg text-red-600">Không tìm thấy người dùng</div>
      </div>
    );
  }

  return (
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
          Cập nhật thông tin người dùng
        </h1>
      </div>

      {/* User Info Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Thông tin hiện tại
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">ID:</span>
            <span className="ml-2 font-medium">{user.id}</span>
          </div>
          <div>
            <span className="text-gray-600">Vai trò:</span>
            <span className="ml-2 font-medium">
              {user.roles?.join(", ") || "Customer"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Trạng thái:</span>
            <span
              className={`ml-2 px-2 py-1 text-xs rounded-full ${
                user.isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.isActive ? "Hoạt động" : "Đã khóa"}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="ml-2 font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleString("vi-VN")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <UserForm
        initialData={{
          fullName: user.fullName || "",
          email: user.email || "",
          userName: user.userName || "",
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
        submitButtonText="Cập nhật"
        title="Chỉnh sửa thông tin"
      />
    </div>
  );
}

export default function UpdateUserPage() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-96">
            <div className="text-lg">Đang tải...</div>
          </div>
        }
      >
        <UpdateUserContent />
      </Suspense>
    </AdminLayout>
  );
}
