"use client";

import { useState, useEffect, Suspense } from "react";
import { UserService } from "@/services/userService";
import { UserDto } from "@/types/generated-api";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import Link from "next/link";

function UserDetailContent() {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
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
      // response is already UserDto[] due to getAllUsers implementation
      const users: UserDto[] = Array.isArray(response) ? response : [];

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

  const handleBack = () => {
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
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
          Chi tiết người dùng
        </h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-2xl font-bold">
              {user.userName?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-6 text-white">
              <h2 className="text-2xl font-bold">{user.fullName || "N/A"}</h2>
              <p className="text-indigo-100">@{user.userName}</p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin cơ bản
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ID người dùng
                  </label>
                  <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                    {user.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên đăng nhập
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.fullName || "Chưa cập nhật"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trạng thái tài khoản
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <span
                    className={`mt-1 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Hoạt động" : "Đã khóa"}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <div className="mt-1">
                    {user.roles && user.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Customer
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày tạo
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </button>
            <Link href={`/admin/users/update?id=${user.id}`}>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Chỉnh sửa
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  return (
    <AdminLayout>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-96">
            <div className="text-lg">Đang tải...</div>
          </div>
        }
      >
        <UserDetailContent />
      </Suspense>
    </AdminLayout>
  );
}
