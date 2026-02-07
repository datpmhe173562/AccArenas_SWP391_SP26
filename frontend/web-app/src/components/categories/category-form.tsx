"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreateCategory, useUpdateCategory, useCategory } from "@/hooks/useCategories";
import { CreateCategoryRequest, UpdateCategoryRequest } from "@/types/generated-api";
import { showSuccess, showError, showLoading, hideLoading } from "@/lib/sweetalert";
import { uploadService } from "@/services/uploadService";

interface CategoryFormProps {
  id?: string;
}

export const CategoryForm = ({ id }: CategoryFormProps) => {
  const router = useRouter();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: "",
    slug: "",
    image: "",
    isActive: true,
  });

  const { data: existingCategory, isLoading: isLoadingCategory } = useCategory(id || "", isEdit);
  
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  useEffect(() => {
    if (isEdit && existingCategory) {
      setFormData({
        name: existingCategory.name,
        slug: existingCategory.slug || "",
        image: existingCategory.image || "",
        isActive: existingCategory.isActive,
      });
    }
  }, [isEdit, existingCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    showLoading("Đang tải ảnh lên...");
    try {
      const file = files[0];
      const result = await uploadService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image: result.url
      }));
      showSuccess("Tải ảnh lên thành công");
    } catch (error: any) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      showError("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, payload: formData as UpdateCategoryRequest });
        showSuccess("Cập nhật danh mục thành công");
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess("Tạo danh mục thành công");
      }
      router.push("/marketer/categories");
    } catch (error: any) {
      showError(error.message || "Đã có lỗi xảy ra");
    }
  };

  if (isEdit && isLoadingCategory) {
    return <div className="text-center py-10">Đang tải thông tin...</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        {isEdit ? "Cập nhật danh mục" : "Thêm danh mục mới"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tên danh mục</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Ví dụ: MOBA, FPS, RPG..."
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Ví dụ: moba, fps, rpg..."
          />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2 space-y-4">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Hình ảnh</label>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                name="image"
                value={formData.image || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="Nhập link hình ảnh hoặc chọn file bên phải..."
              />
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Chọn ảnh từ máy
              </label>
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Danh mục đang hoạt động</label>
        </div>

        {/* Form Actions */}
        <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-bold"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-10 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-600/30"
          >
            {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
          </button>
        </div>
      </form>
    </div>
  );
};
