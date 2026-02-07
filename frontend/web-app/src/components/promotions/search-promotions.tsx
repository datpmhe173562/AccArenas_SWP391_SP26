"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePromotions, useDeletePromotion } from "@/hooks/usePromotions";
import { PromotionDto } from "@/types/generated-api";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";
import { format } from "date-fns";

export const SearchPromotions = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [isActiveFilter]);

  const {
    data: promotionsData,
    isLoading,
    error,
    refetch,
  } = usePromotions({
    code: debouncedQuery || undefined,
    isActive: isActiveFilter,
    page,
    pageSize,
  });

  const deletePromotion = useDeletePromotion();

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setIsActiveFilter(undefined);
    setSortOrder("newest");
    setPage(1);
  }, []);

  const handleDelete = async (promotion: PromotionDto) => {
    const isConfirmed = await showConfirm(
      `Bạn có chắc chắn muốn xóa khuyến mãi "${promotion.code}"?`,
      "Xác nhận xóa"
    );

    if (!isConfirmed) return;

    try {
      await deletePromotion.mutateAsync(promotion.id);
      showSuccess("Đã xóa khuyến mãi thành công");
      refetch();
    } catch (error: any) {
      showError(error.message || "Không thể xóa khuyến mãi");
    }
  };

  const handleEdit = (promotion: PromotionDto) => {
    router.push(`/marketer/promotions/update/${promotion.id}`);
  };

  const hasActiveFilters = searchQuery || isActiveFilter !== undefined || sortOrder !== "newest";

  // Client-side sorting for now since API doesn't seem to have sorting param
  const sortedPromotions = [...(promotionsData?.items || [])].sort((a: PromotionDto, b: PromotionDto) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOrder === "code_asc") {
      return a.code.localeCompare(b.code);
    } else if (sortOrder === "code_desc") {
      return b.code.localeCompare(a.code);
    } else if (sortOrder === "discount_desc") {
      return b.discountPercent - a.discountPercent;
    } else if (sortOrder === "discount_asc") {
      return a.discountPercent - b.discountPercent;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Tìm kiếm Khuyến mãi
          </h2>
          <div className="flex gap-4 items-center">
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Xóa bộ lọc
              </button>
            )}
            <button
              onClick={() => router.push("/marketer/promotions/add")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm khuyến mãi
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Query */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm (Mã)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập mã khuyến mãi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={isActiveFilter === undefined ? "" : isActiveFilter.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setIsActiveFilter(value === "" ? undefined : value === "true");
              }}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Mới nhất (Mặc định)</option>
              <option value="code_asc">Mã (A-Z)</option>
              <option value="code_desc">Mã (Z-A)</option>
              <option value="discount_desc">Giảm giá (Cao - Thấp)</option>
              <option value="discount_asc">Giảm giá (Thấp - Cao)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Mã: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {isActiveFilter !== undefined && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Trạng thái: {isActiveFilter ? "Hoạt động" : "Không hoạt động"}
                  <button
                    onClick={() => setIsActiveFilter(undefined)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {sortOrder !== "newest" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Sắp xếp: {sortOrder === "code_asc" ? "Mã (A-Z)" : sortOrder === "code_desc" ? "Mã (Z-A)" : sortOrder === "discount_desc" ? "Giảm giá (Cao - Thấp)" : "Giảm giá (Thấp - Cao)"}
                  <button
                    onClick={() => setSortOrder("newest")}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div>
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Lỗi khi tìm kiếm: {error.message}
            </p>
          </div>
        ) : (
          <SearchResultsList
            promotions={sortedPromotions}
            isLoading={isLoading}
            page={page}
            totalCount={promotionsData?.totalCount || sortedPromotions.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletePromotion={deletePromotion}
          />
        )}
      </div>
    </div>
  );
};

// Search Results List Component
interface SearchResultsListProps {
  promotions: PromotionDto[];
  isLoading: boolean;
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (promotion: PromotionDto) => void;
  onDelete: (promotion: PromotionDto) => void;
  deletePromotion: any;
}

const SearchResultsList = ({
  promotions,
  isLoading,
  page,
  totalCount,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  deletePromotion,
}: SearchResultsListProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không tìm thấy kết quả
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Tìm thấy {totalCount} kết quả
        {totalPages > 1 && ` (Trang ${page}/${totalPages})`}
      </div>

      {/* Results Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã Voucher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảm giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian hiệu lực
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promotions.map((promotion: PromotionDto) => (
                <tr 
                  key={promotion.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {promotion.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {promotion.description || "Không có mô tả"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-green-600">
                      -{promotion.discountPercent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">
                      <div className="mb-1">Từ: {format(new Date(promotion.startDate), "dd/MM/yyyy HH:mm")}</div>
                      <div>Đến: {format(new Date(promotion.endDate), "dd/MM/yyyy HH:mm")}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promotion.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {promotion.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(promotion)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(promotion)}
                      disabled={deletePromotion.isPending}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          <span className="text-sm text-gray-700">
            Trang {page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </>
  );
};
