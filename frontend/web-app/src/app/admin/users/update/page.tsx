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
    try {
      setLoading(true);
      // TODO: Implement getUserById API
      // Tạm thời lấy từ danh sách users
      const response = await UserService.getAllUsers();
      let users: UserDto[] = [];

      if (response.success && response.data) {
        users = response.data || [];
      } else if (Array.isArray(response)) {
        users = response;
      } else {
        // @ts-ignore
        users = response.data || response.items || [];
      }

      const foundUser = users.find((u) => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        console.error("User not found");
        router.push("/admin/users");
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: {
    fullName: string;
    email: string;
    userName: string;
  }) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement updateUser API
      console.log("Updating user:", { ...data, id: user.id });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to users list
      router.push("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
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
