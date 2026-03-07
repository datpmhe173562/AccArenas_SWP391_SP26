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

    showLoading("Đang tải ảnh lên máy chủ...");
    try {
      const file = files[0];
      const result = await uploadService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, result.url]
      }));
      showSuccess("Đã thêm ảnh thành công");
    } catch (error: any) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      showError("Vui lòng chọn Danh mục game");
      return;
    }

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: id!, payload: formData as UpdateGameAccountRequest });
        showSuccess("Cập nhật thành công!");
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess("Tạo tài khoản thành công!");
      }
      router.push("/marketer/products");
    } catch (error: any) {
      showError(error.message || "Đã có lỗi xảy ra");
    }
  };

  if (isEdit && isLoadingAccount) {
    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-50 rounded-full opacity-50 blur-3xl -z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center text-white">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {isEdit ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </h2>
            <p className="text-gray-400 font-medium text-sm">Điền đầy đủ các thông tin bên dưới để đăng bán tài khoản</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Thông tin cơ bản */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
               <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-sm">01</span>
               <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Thông tin cơ bản</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Tên Game</label>
                <input
                  type="text"
                  name="game"
                  value={formData.game}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-800"
                  placeholder="VD: Liên Minh Huyền Thoại, Wild Rift..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Danh mục sản phẩm</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-white font-medium text-gray-800"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categoriesData?.items?.map((cat: CategoryDto) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Xếp hạng / Rank</label>
                <input
                  type="text"
                  name="rank"
                  value={formData.rank || ""}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-800"
                  placeholder="VD: Thách Đấu, Kim Cương..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Giá bán niêm yết (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-black text-indigo-600 text-lg"
                    placeholder="0"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xs tracking-widest">VNĐ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tài khoản & Bảo mật */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
               <span className="w-8 h-8 bg-pink-50 text-pink-600 rounded-lg flex items-center justify-center font-bold text-sm">02</span>
               <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Tài khoản & Bảo mật</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Tên đăng nhập / Email</label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium text-gray-800"
                  placeholder="Nhập username hoặc gmail..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">Mật khẩu truy cập</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-mono text-gray-800"
                  placeholder="Nhập password tài khoản..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hình ảnh sản phẩm */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
               <span className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center font-bold text-sm">03</span>
               <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Hình ảnh minh họa</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm"
                    placeholder="Dán link ảnh tại đây hoặc tải file bên cạnh..."
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition font-bold text-xs uppercase tracking-widest"
                  >
                    Thêm
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
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Tải lên từ máy
                  </label>
                </div>
              </div>

              {formData.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pt-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border-2 border-white shadow-xl bg-gray-50 hover:shadow-indigo-100 transition-all">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(index)}
                        className="absolute top-2 right-2 bg-red-500/90 text-white rounded-xl p-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-indigo-600/90 py-1 text-center text-[8px] font-black text-white uppercase tracking-widest">Ảnh chính</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Trạng thái & Hoàn tất */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isAvailable"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange as any}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <div>
                <label htmlFor="isAvailable" className="text-sm font-black text-gray-900 uppercase tracking-widest">Trạng thái sẵn sàng</label>
                <p className="text-xs text-gray-400 font-medium tracking-tight">Kích hoạt để sản phẩm hiển thị trên sàn giao dịch</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 md:flex-none px-10 py-4 bg-white border border-gray-200 text-gray-400 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition font-black text-xs uppercase tracking-[0.2em]"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 md:flex-none px-12 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100"
              >
                {isEdit ? "Cập nhật ngay" : "Đăng bán ngay"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
