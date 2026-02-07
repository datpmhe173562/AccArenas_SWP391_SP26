"use client";

import { useCategory } from "@/hooks/useCategories";
import { useParams, useRouter } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";
import { useDeleteCategory } from "@/hooks/useCategories";
import { useEffect } from "react";

export default function CategoryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const { data: category, isLoading, error } = useCategory(id);
  const deleteMutation = useDeleteCategory();

  useEffect(() => {
    console.log("Category Detail - ID:", id);
    console.log("Category Detail - Data:", category);
    console.log("Category Detail - Loading:", isLoading);
    console.log("Category Detail - Error:", error);
  }, [id, category, isLoading, error]);

  const handleDelete = async () => {
    if (!category) return;

    const isConfirmed = await showConfirm(
      `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      "Xác nhận xóa"
    );

    if (!isConfirmed) return;

    try {
      await deleteMutation.mutateAsync(id);
      showSuccess("Đã xóa danh mục thành công");
      router.push("/marketer/categories");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Không thể xóa danh mục. Danh mục này có thể đang được sử dụng.";
      showError(errorMessage);
      console.error("Delete error:", err);
    }
  };

  if (isLoading) {
    return (
      <MarketerLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin danh mục...</p>
          </div>
        </div>
      </MarketerLayout>
    );
  }

  if (error) {
    return (
      <MarketerLayout>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-red-600">{error.message}</p>
            <button
              onClick={() => router.push("/marketer/categories")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </MarketerLayout>
    );
  }

  if (!category) {
    return (
      <MarketerLayout>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Không tìm thấy danh mục</h3>
            <p className="text-yellow-600">Danh mục với ID "{id}" không tồn tại hoặc đã bị xóa.</p>
            <button
              onClick={() => router.push("/marketer/categories")}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </MarketerLayout>
    );
  }


  return (
    <MarketerLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => router.push("/marketer/categories")} className="hover:text-indigo-600 transition">Danh mục</button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Chi tiết</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Column */}
            <div className="p-8 bg-gray-50">
              <div className="space-y-4">
                {category.image ? (
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video bg-indigo-100 flex items-center justify-center rounded-2xl">
                    <svg className="w-20 h-20 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{category.name}</h1>
                    {category.slug && (
                      <p className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded inline-block">
                        /{category.slug}
                      </p>
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-xl border-2 font-bold ${category.isActive ? "border-green-200 text-green-600 bg-green-50" : "border-red-200 text-red-600 bg-red-50"}`}>
                    {category.isActive ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-8 gap-x-12 mt-10">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">ID Danh mục</p>
                    <p className="text-sm font-mono text-gray-800 bg-gray-100 px-2 py-1 rounded inline-block">{category.id}</p>
                  </div>
                  
                  {category.slug && (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">Slug</p>
                      <p className="text-lg font-semibold text-gray-800">{category.slug}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => router.push(`/marketer/categories/update/${category.id}`)}
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
