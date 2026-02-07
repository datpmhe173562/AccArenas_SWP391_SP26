"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCreatePromotion, useUpdatePromotion, usePromotion } from "@/hooks/usePromotions";
import { CreatePromotionRequest, UpdatePromotionRequest } from "@/types/generated-api";
import { showSuccess, showError } from "@/lib/sweetalert";
import { format } from "date-fns";

interface PromotionFormProps {
  id?: string;
}

export const PromotionForm = ({ id }: PromotionFormProps) => {
  const router = useRouter();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreatePromotionRequest>({
    code: "",
    description: "",
    discountPercent: 0,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const { data: existingPromotion, isLoading: isLoadingPromotion } = usePromotion(id || "", isEdit);
  
  const createMutation = useCreatePromotion();
  const updateMutation = useUpdatePromotion();

  useEffect(() => {
    if (isEdit && existingPromotion) {
      setFormData({
        code: existingPromotion.code,
        description: existingPromotion.description || "",
        discountPercent: existingPromotion.discountPercent,
        startDate: format(new Date(existingPromotion.startDate), "yyyy-MM-dd'T'HH:mm"),
        endDate: format(new Date(existingPromotion.endDate), "yyyy-MM-dd'T'HH:mm"),
        isActive: existingPromotion.isActive,
      });
    }
  }, [isEdit, existingPromotion]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code) {
      showError("Vui lòng nhập mã khuyến mãi");
      return;
    }

    if (formData.discountPercent <= 0 || formData.discountPercent > 100) {
        showError("Phần trăm giảm giá phải từ 1 đến 100");
        return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        showError("Ngày kết thúc phải sau ngày bắt đầu");
        return;
    }

    // Convert local datetime to UTC ISO string for backend
    const payload = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, payload: payload as UpdatePromotionRequest });
        showSuccess("Cập nhật khuyến mãi thành công");
      } else {
        await createMutation.mutateAsync(payload);
        showSuccess("Tạo khuyến mãi thành công");
      }
      router.push("/marketer/promotions");
    } catch (error: any) {
      showError(error.message || "Đã có lỗi xảy ra");
    }
  };

  if (isEdit && isLoadingPromotion) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        {isEdit ? "Cập nhật Voucher" : "Thêm Voucher mới"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Code */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mã Voucher</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none font-mono uppercase"
            placeholder="Ví dụ: SUMMER2024"
          />
        </div>

        {/* Discount Percent */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Giảm giá (%)</label>
          <input
            type="number"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleInputChange}
            required
            min="1"
            max="100"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Ví dụ: 20"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Ngày bắt đầu</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Ngày kết thúc</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mô tả</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
          />
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
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Khuyến mãi đang hoạt động</label>
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
            {isEdit ? "Lưu thay đổi" : "Tạo Voucher"}
          </button>
        </div>
      </form>
    </div>
  );
};
