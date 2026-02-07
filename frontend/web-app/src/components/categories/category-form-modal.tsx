"use client";

import { useState, useEffect } from "react";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import { CreateCategoryRequest, UpdateCategoryRequest, CategoryDto } from "@/types/generated-api";
import { showSuccess, showError, showLoading, hideLoading } from "@/lib/sweetalert";
import { uploadService } from "@/services/uploadService";

interface CategoryFormModalProps {
  category?: CategoryDto;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryFormModal = ({
  category,
  onClose,
  onSuccess,
}: CategoryFormModalProps) => {
  const isEdit = !!category;
  
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: category?.name || "",
    slug: category?.slug || "",
    image: category?.image || "",
    isActive: category?.isActive ?? true,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    } else if (formData.name.length < 2) {
      newErrors.name = "Tên danh mục phải có ít nhất 2 ký tự";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên danh mục không được quá 100 ký tự";
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
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: category.id,
          payload: formData as UpdateCategoryRequest,
        });
        showSuccess("Cập nhật danh mục thành công");
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess("Tạo danh mục thành công");
      }
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data || "Đã có lỗi xảy ra";
      showError(errorMessage);
      console.error("Error saving category:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreateCategoryRequest,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as string]) {
      setErrors((prev) => ({
        ...prev,
        [field as string]: "",
      }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showLoading("Đang tải ảnh lên...");
    try {
      const file = files[0];
      const result = await uploadService.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        image: result.url,
      }));
      showSuccess("Tải ảnh lên thành công");
    } catch (error: any) {
      showError(error.response?.data || "Không thể tải ảnh lên");
    } finally {
      hideLoading();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Cập nhật danh mục" : "Tạo danh mục mới"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.name ? "border-red-300" : "border-gray-300"
              } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none`}
              placeholder="Nhập tên danh mục..."
              maxLength={100}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.name.length}/100 ký tự
            </p>
          </div>

          {/* Slug Field */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={formData.slug || ""}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.slug ? "border-red-300" : "border-gray-300"
              } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none`}
              placeholder="Nhập slug (không bắt buộc)..."
              maxLength={100}
            />
            {errors.slug && (
              <p className="mt-2 text-sm text-red-600">{errors.slug}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {(formData.slug || "").length}/100 ký tự
            </p>
          </div>

          {/* Image Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hình ảnh
            </label>
            
            <div className="space-y-4">
              {/* Image URL Input */}
              <input
                type="text"
                value={formData.image || ""}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                placeholder="Nhập URL hình ảnh hoặc tải lên từ máy..."
              />

              {/* File Upload */}
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="category-image-upload"
                />
                <label
                  htmlFor="category-image-upload"
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer flex items-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Chọn ảnh từ máy
                </label>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("image", "")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* IsActive Field */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Danh mục đang hoạt động
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
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
              {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
