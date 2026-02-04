"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { UserForm } from "@/components/users";

export default function AddUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: {
    fullName: string;
    email: string;
    userName: string;
  }) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to create user
      console.log("Creating user:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to users list
      router.push("/admin/users");
    } catch (error) {
      console.error("Error creating user:", error);
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
        />
      </div>
    </AdminLayout>
  );
}
