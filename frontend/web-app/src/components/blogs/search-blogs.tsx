"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBlogs, useDeleteBlog, useToggleBlogPublish } from "@/hooks/useBlogs";
import { BlogPostDto } from "@/types/generated-api";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";

type SortKey = "title_asc" | "title_desc" | "date_desc" | "date_asc";

export const SearchBlogs = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPublishedFilter, setIsPublishedFilter] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortKey>("date_desc");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [isPublishedFilter, sortBy]);

  const { data: blogsData, isLoading, error, refetch } = useBlogs(page, 10);
  const deleteBlog = useDeleteBlog();
  const togglePublish = useToggleBlogPublish();

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setIsPublishedFilter(undefined);
    setSortBy("date_desc");
    setPage(1);
  }, []);

  const handleDelete = async (blog: BlogPostDto) => {
    const isConfirmed = await showConfirm(
      `Bạn có chắc muốn xóa bài viết "${blog.title}"?`,
      "Xác nhận xóa"
    );
    if (!isConfirmed) return;
    try {
      await deleteBlog.mutateAsync(blog.id);
      showSuccess("Đã xóa bài viết thành công");
      refetch();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleTogglePublish = async (blog: BlogPostDto) => {
    try {
      await togglePublish.mutateAsync(blog.id);
      showSuccess(blog.isPublished ? "Đã hủy xuất bản bài viết" : "Đã xuất bản bài viết");
      refetch();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const hasActiveFilters = searchQuery || isPublishedFilter !== undefined || sortBy !== "date_desc";

  const filteredBlogs = (blogsData?.items || [])
    .filter((blog: BlogPostDto) => {
      const matchesSearch =
        !debouncedQuery ||
        blog.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        blog.slug.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesStatus =
        isPublishedFilter === undefined || blog.isPublished === isPublishedFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: BlogPostDto, b: BlogPostDto) => {
      switch (sortBy) {
        case "title_asc":  return a.title.localeCompare(b.title, "vi");
        case "title_desc": return b.title.localeCompare(a.title, "vi");
        case "date_asc":   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date_desc":  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

  const pageSize = 10;
  const totalCount = filteredBlogs.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tìm kiếm Bài viết</h2>
          <div className="flex gap-4 items-center">
            {hasActiveFilters && (
              <button onClick={handleReset} className="text-sm text-blue-600 hover:text-blue-800">
                Xóa bộ lọc
              </button>
            )}
            <button
              onClick={() => router.push("/marketer/blogs/add")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm bài viết
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tiêu đề, slug..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={isPublishedFilter === undefined ? "" : isPublishedFilter.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setIsPublishedFilter(val === "" ? undefined : val === "true");
              }}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Đã xuất bản</option>
              <option value="false">Chưa xuất bản</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date_desc">Ngày tạo: Mới nhất</option>
              <option value="date_asc">Ngày tạo: Cũ nhất</option>
              <option value="title_asc">Tiêu đề: A → Z</option>
              <option value="title_desc">Tiêu đề: Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Lỗi khi tải dữ liệu: {error.message}</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center text-gray-500">Đang tải...</div>
      ) : (
        <>
          <div className="mb-2 text-sm text-gray-600">
            Tìm thấy {totalCount} kết quả{totalPages > 1 && ` (Trang ${page}/${totalPages})`}
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Không tìm thấy bài viết nào
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog: BlogPostDto) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/marketer/blogs/detail/${blog.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{blog.title}</div>
                        <div className="text-xs text-gray-400">{blog.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{blog.categoryName || "—"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            blog.isPublished
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.isPublished ? "Đã xuất bản" : "Nháp"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTogglePublish(blog); }}
                          className={`mr-3 ${blog.isPublished ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}`}
                        >
                          {blog.isPublished ? "Hủy xuất bản" : "Xuất bản"}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/marketer/blogs/update/${blog.id}`); }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Cập nhật
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(blog); }}
                          disabled={deleteBlog.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <span className="text-sm text-gray-700">Trang {page} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
