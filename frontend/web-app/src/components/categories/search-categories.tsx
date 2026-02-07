"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { CategoryDto } from "@/types/generated-api";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";

export const SearchCategories = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

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
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useCategories(page, 10);

  const deleteCategory = useDeleteCategory();

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setIsActiveFilter(undefined);
    setPage(1);
  }, []);

  const handleDelete = async (category: CategoryDto) => {
    const isConfirmed = await showConfirm(
      `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      "Xác nhận xóa"
    );

    if (!isConfirmed) return;

    try {
      await deleteCategory.mutateAsync(category.id);
      showSuccess("Đã xóa danh mục thành công");
      refetch();
    } catch (error: any) {
      showError(error.message);
      console.error("Error deleting category:", error);
    }
  };

  const handleView = (category: CategoryDto) => {
    router.push(`/marketer/categories/detail/${category.id}`);
  };

  const handleEdit = (category: CategoryDto) => {
    router.push(`/marketer/categories/update/${category.id}`);
  };

  const hasActiveFilters = searchQuery || isActiveFilter !== undefined;

  // Filter categories based on search query and status
  const filteredCategories = (categoriesData?.items || []).filter((category: CategoryDto) => {
    const matchesSearch = !debouncedQuery || 
      category.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      (category.slug && category.slug.toLowerCase().includes(debouncedQuery.toLowerCase()));
    
    const matchesStatus = isActiveFilter === undefined || category.isActive === isActiveFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Tìm kiếm Danh mục
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
              onClick={() => router.push("/marketer/categories/add")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Query */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, slug..."
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
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg
                    className="animate-spin h-4 w-4 text-blue-600"
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
                </div>
              )}
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
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Từ khóa: {searchQuery}
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
            categories={filteredCategories}
            isLoading={isLoading}
            page={page}
            totalCount={filteredCategories.length}
            onPageChange={setPage}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deleteCategory={deleteCategory}
          />
        )}
      </div>
    </div>
  );
};

// Search Results List Component
interface SearchResultsListProps {
  categories: CategoryDto[];
  isLoading: boolean;
  page: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onView: (category: CategoryDto) => void;
  onEdit: (category: CategoryDto) => void;
  onDelete: (category: CategoryDto) => void;
  deleteCategory: any;
}

const SearchResultsList = ({
  categories,
  isLoading,
  page,
  totalCount,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  deleteCategory,
}: SearchResultsListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 rounded-lg h-80 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalCount === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên danh mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
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
            {categories.map((category: CategoryDto) => (
              <tr 
                key={category.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onView(category)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-16 w-24 bg-gray-100 rounded-lg overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {category.id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {category.slug || <span className="italic text-gray-400">Không có</span>}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category);
                    }}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Cập nhật
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category);
                    }}
                    disabled={deleteCategory.isPending}
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
