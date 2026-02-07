"use client";

import { useGameAccount } from "@/hooks/useGameAccounts";
import { useParams, useRouter } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";
import { useDeleteGameAccount } from "@/hooks/useGameAccounts";

export default function GameAccountDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { data: account, isLoading, error } = useGameAccount(id);
  const deleteMutation = useDeleteGameAccount();

  const handleDelete = async () => {
    const isConfirmed = await showConfirm(
      "Bạn có chắc chắn muốn xóa game account này?",
      "Xác nhận xóa"
    );

    if (!isConfirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Đã xóa thành công");
      router.push("/marketer/products");
    } catch (err) {
      showError("Không thể xóa sản phẩm");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (isLoading) return <div className="p-8 text-center">Đang tải...</div>;
  if (error || !account) return <div className="p-8 text-center text-red-500">Lỗi: {error?.message || "Không tìm thấy sản phẩm"}</div>;

  return (
    <MarketerLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => router.push("/marketer/products")} className="hover:text-indigo-600 transition">Sản phẩm</button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Chi tiết</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Images Column */}
            <div className="p-8 bg-gray-50">
              <div className="space-y-4">
                {account.images && account.images.length > 0 ? (
                  <>
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                      <img src={account.images[0]} alt={account.game} className="w-full h-full object-cover" />
                    </div>
                    {account.images.length > 1 && (
                      <div className="grid grid-cols-3 gap-4">
                        {account.images.slice(1).map((img, idx) => (
                          <div key={idx} className="aspect-square rounded-xl overflow-hidden border-2 border-white shadow-sm">
                            <img src={img} alt={`${account.game} ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-video bg-indigo-100 flex items-center justify-center rounded-2xl">
                    <svg className="w-20 h-20 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.797 1.599l2.5 1.875A2 2 0 008 9.816V15a1 1 0 102 0V9.816a2 2 0 002.703-.375l2.5-1.875A2 2 0 0016 6.816V5a2 2 0 00-2-2H4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{account.game}</h1>
                    <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-bold px-4 py-1.5 rounded-full">
                      {account.categoryName}
                    </span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl border-2 font-bold ${account.isAvailable ? "border-green-200 text-green-600 bg-green-50" : "border-red-200 text-red-600 bg-red-50"}`}>
                    {account.isAvailable ? "CÒN HÀNG" : "ĐÃ BÁN"}
                  </div>
                </div>

                <div className="text-5xl font-black text-indigo-600 mb-10 tracking-tight">
                  {formatPrice(account.price)}
                </div>

                <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">Tên tài khoản</p>
                    <p className="text-lg font-semibold text-gray-800">{account.accountName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">Xếp hạng (Rank)</p>
                    <p className="text-lg font-semibold text-gray-800">{account.rank || "Chưa có rank"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">Mật khẩu</p>
                    <p className="text-lg font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">{account.password}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">Ngày đăng</p>
                    <p className="text-lg font-semibold text-gray-800">{new Date(account.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => router.push(`/marketer/products/update/${account.id}`)}
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                >
                  Sửa thông tin
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-8 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition border-2 border-red-100"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MarketerLayout>
  );
}
