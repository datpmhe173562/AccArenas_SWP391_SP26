"use client";

import { useGameAccount } from "@/hooks/useGameAccounts";
import { useParams, useRouter } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";
import { useDeleteGameAccount } from "@/hooks/useGameAccounts";
import { formatCurrency } from "@/lib/utils";

export default function GameAccountDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { data: account, isLoading, error } = useGameAccount(id);
  const deleteMutation = useDeleteGameAccount();

  const handleDelete = async () => {
    const isConfirmed = await showConfirm(
      "Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa game account này?",
      "Xác nhận xóa vĩnh viễn"
    );

    if (!isConfirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Đã xóa tài khoản thành công");
      router.push("/marketer/products");
    } catch (err) {
      showError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
    }
  };

  if (isLoading) return (
    <MarketerLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-500 font-medium">Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    </MarketerLayout>
  );

  if (error || !account) return (
    <MarketerLayout>
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100">
             <div className="text-5xl mb-4">⚠️</div>
             <h2 className="text-2xl font-bold mb-2">Lỗi tải dữ liệu</h2>
             <p className="mb-6">{error?.message || "Không tìm thấy sản phẩm yêu cầu"}</p>
             <button onClick={() => router.push("/marketer/products")} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition">Quay lại danh sách</button>
        </div>
      </div>
    </MarketerLayout>
  );

  const images = account.images?.length > 0 ? account.images : [];

  return (
    <MarketerLayout>
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        {/* Header/Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => router.push("/marketer/products")} className="hover:text-indigo-600 transition flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Sản phẩm
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{account.game}</span>
          </div>
          
          <div className="flex items-center gap-2">
             <button 
                onClick={() => router.push(`/marketer/products/update/${account.id}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Chỉnh sửa
              </button>
              <button 
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-100 transition-all border border-red-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Xóa
              </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Side: Images */}
            <div className="lg:col-span-5 p-6 bg-gray-50/50 flex flex-col gap-4">
              {images.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-2 border-white">
                    <img src={images[0]} alt={account.game} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3">
                        <span className="bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black text-white shadow-lg">
                            HÌNH ẢNH CHÍNH
                        </span>
                    </div>
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {images.slice(1, 4).map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white shadow-sm">
                          <img src={img} alt={`${account.game} preview ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] bg-indigo-50/50 flex items-center justify-center rounded-2xl border-2 border-dashed border-indigo-100">
                  <div className="text-center p-6">
                    <svg className="w-12 h-12 text-indigo-200 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-indigo-300 font-bold uppercase tracking-widest text-[10px]">Chưa có hình ảnh</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Product Details */}
            <div className="lg:col-span-7 p-8 md:p-10 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black tracking-wider uppercase">
                      {account.categoryName}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${account.isAvailable ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                      {account.isAvailable ? '• ĐANG BÁN' : '• ĐÃ BÁN'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-gray-900 leading-tight">
                    {account.game}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Giá niêm yết</p>
                  <div className="text-3xl font-black text-indigo-600 tracking-tighter">
                    {formatCurrency(account.price)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Tên tài khoản</div>
                    <div className="font-bold text-gray-800 text-sm">{account.accountName}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Mật khẩu</div>
                    <div className="font-mono font-bold text-indigo-600 text-sm">{account.password}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Xếp hạng / Rank</div>
                    <div className="font-bold text-gray-800 text-sm">{account.rank || "N/A"}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-100 transition-all flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Ngày đăng</div>
                    <div className="font-bold text-gray-800 text-sm">{new Date(account.createdAt).toLocaleDateString("vi-VN")}</div>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-8 flex items-center justify-between text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Bảo mật tài khoản: Cao
                </div>
                <span>© ACCARENAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketerLayout>
  );
}
