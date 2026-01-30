"use client";

import { useState } from "react";
import { useCreateCategory } from "@/hooks/useCategories";
import { CreateCategoryRequest } from "@/types/generated-api";

interface CreateCategoryFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCategoryForm = ({
  onSuccess,
  onCancel,
}: CreateCategoryFormProps) => {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    slug: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createCategory = useCreateCategory();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên category không được để trống";
    } else if (formData.name.length < 2) {
      newErrors.name = "Tên category phải có ít nhất 2 ký tự";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên category không được quá 100 ký tự";
    }

    if (formData.slug && formData.slug.length > 100) {
      newErrors.slug = "Slug không được quá 100 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createCategory.mutateAsync(formData);

      // Reset form
      setFormData({ name: "", slug: "", isActive: true });
      setErrors({});

      onSuccess?.();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreateCategoryRequest,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tạo Category Mới</h2>
        <p className="text-gray-600 mt-1">Điền thông tin để tạo category mới</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tên Category <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Nhập tên category..."
            maxLength={100}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.name.length}/100 ký tự
          </p>
        </div>

        {/* Slug Field */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Slug
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug || ""}
            onChange={(e) => handleInputChange("slug", e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.slug ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Nhập slug category (không bắt buộc)..."
            maxLength={100}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {(formData.slug || "").length}/100 ký tự
          </p>
        </div>

        {/* Active Status Field */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Kích hoạt category
            </span>
          </label>
        </div>

        {/* Error Display */}
        {createCategory.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Lỗi khi tạo category
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  {createCategory.error?.message ||
                    "Đã có lỗi xảy ra, vui lòng thử lại"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Display */}
        {createCategory.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Category đã được tạo thành công!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={createCategory.isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {createCategory.isPending && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m100 50.01 100 0 0 99.98 -100 0 0 -99.98z"
                ></path>
              </svg>
            )}
            Tạo Category
          </button>
        </div>
      </form>
    </div>
  );
};
