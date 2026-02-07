"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { 
  useCreateGameAccount, 
  useUpdateGameAccount, 
  useGameAccount 
} from "@/hooks/useGameAccounts";
import { 
  CreateGameAccountRequest, 
  UpdateGameAccountRequest, 
  CategoryDto 
} from "@/types/generated-api";
import { showSuccess, showError, showLoading, hideLoading } from "@/lib/sweetalert";
import { uploadService } from "@/services/uploadService";

interface GameAccountFormProps {
  id?: string;
}

export const GameAccountForm = ({ id }: GameAccountFormProps) => {
  const router = useRouter();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateGameAccountRequest>({
    game: "",
    accountName: "",
    password: "",
    rank: "",
    price: 0,
    currency: "VND",
    isAvailable: true,
    categoryId: "",
    imageUrls: [],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");

  const { data: categoriesData } = useCategories(1, 100);
  const { data: existingAccount, isLoading: isLoadingAccount } = useGameAccount(id || "", isEdit);
  
  const createMutation = useCreateGameAccount();
  const updateMutation = useUpdateGameAccount();

  useEffect(() => {
    if (isEdit && existingAccount) {
      setFormData({
        game: existingAccount.game,
        accountName: existingAccount.accountName,
        password: existingAccount.password || "",
        rank: existingAccount.rank || "",
        price: existingAccount.price,
        currency: existingAccount.currency || "VND",
        isAvailable: existingAccount.isAvailable,
        categoryId: existingAccount.categoryId,
        imageUrls: existingAccount.images || [],
      });
    }
  }, [isEdit, existingAccount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : val
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
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
        imageUrls: [...prev.imageUrls, result.url]
      }));
      showSuccess("Tải ảnh lên thành công");
    } catch (error: any) {
      showError(error.response?.data || "Không thể tải ảnh lên");
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      showError("Vui lòng chọn Category");
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, payload: formData as UpdateGameAccountRequest });
        showSuccess("Cập nhật game account thành công");
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess("Tạo game account thành công");
      }
      router.push("/marketer/products");
    } catch (error: any) {
      showError(error.message || "Đã có lỗi xảy ra");
    }
  };

  if (isEdit && isLoadingAccount) {
    return <div className="text-center py-10">Đang tải thông tin...</div>;
  }

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        {isEdit ? "Cập nhật tài khoản game" : "Thêm tài khoản game mới"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Game Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tên Game</label>
          <input
            type="text"
            name="game"
            value={formData.game}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Ví dụ: Liên Minh Huyền Thoại"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Danh mục (Category)</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-white"
          >
            <option value="">Chọn danh mục</option>
            {categoriesData?.items?.map((cat: CategoryDto) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Account Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tên tài khoản</label>
          <input
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Tên đăng nhập"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Mật khẩu</label>
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Mật khẩu tài khoản"
          />
        </div>

        {/* Rank */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Xếp hạng (Rank)</label>
          <input
            type="text"
            name="rank"
            value={formData.rank || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            placeholder="Ví dụ: Thách Đấu, Kim Cương..."
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Giá bán (VND)</label>
          <div className="relative">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">VNĐ</span>
          </div>
        </div>

        {/* Image URLs */}
        <div className="md:col-span-2 space-y-4">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Hình ảnh (URLs)</label>
          <div className="flex gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                placeholder="Nhập link hình ảnh hoặc chọn file bên phải..."
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Thêm Link
              </button>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-200 hover:border-indigo-500 transition-colors bg-gray-50">
                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImageUrl(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
          <input
            type="checkbox"
            name="isAvailable"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={handleInputChange as any}
            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">Tài khoản đang có sẵn để bán</label>
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
            {isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
          </button>
        </div>
      </form>
    </div>
  );
};
