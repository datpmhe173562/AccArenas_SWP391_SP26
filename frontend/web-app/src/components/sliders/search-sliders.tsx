"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSliders, useDeleteSlider, useToggleSliderStatus } from "@/hooks/useSliders";
import { SliderDto } from "@/types/generated-api";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";

type SortKey = "title_asc" | "title_desc" | "order_asc" | "order_desc";

export const SearchSliders = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortKey>("order_asc");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedQuery(searchQuery); setPage(1); }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setPage(1); }, [isActiveFilter, sortBy]);

  const { data: slidersData, isLoading, error, refetch } = useSliders(page, 10);
  const deleteSlider = useDeleteSlider();
  const toggleStatus = useToggleSliderStatus();

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setIsActiveFilter(undefined);
    setSortBy("order_asc");
    setPage(1);
  }, []);

  const handleDelete = async (slider: SliderDto) => {
    const isConfirmed = await showConfirm(
      `Bạn có chắc muốn xóa slider "${slider.title}"?`,
      "Xác nhận xóa"
    );
    if (!isConfirmed) return;
    try {
      await deleteSlider.mutateAsync(slider.id);
      showSuccess("Đã xóa slider thành công");
      refetch();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleToggle = async (slider: SliderDto) => {
    try {
      await toggleStatus.mutateAsync(slider.id);
      showSuccess(slider.isActive ? "Đã tắt slider" : "Đã bật slider");
      refetch();
    } catch (err: any) {
      showError(err.message);
    }
  };

  const hasActiveFilters = searchQuery || isActiveFilter !== undefined || sortBy !== "order_asc";

  const filteredSliders = (slidersData?.items || [])
    .filter((slider: SliderDto) => {
      const matchesSearch =
        !debouncedQuery || slider.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesStatus =
        isActiveFilter === undefined || slider.isActive === isActiveFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a: SliderDto, b: SliderDto) => {
      switch (sortBy) {
        case "title_asc":   return a.title.localeCompare(b.title, "vi");
        case "title_desc":  return b.title.localeCompare(a.title, "vi");
        case "order_asc":   return (a.order ?? 0) - (b.order ?? 0);
        case "order_desc":  return (b.order ?? 0) - (a.order ?? 0);
        default: return 0;
      }
    });

  const pageSize = 10;
  const totalCount = filteredSliders.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Tìm kiếm Slider</h2>
          <div className="flex gap-4 items-center">
            {hasActiveFilters && (
              <button onClick={handleReset} className="text-sm text-blue-600 hover:text-blue-800">
                Xóa bộ lọc
              </button>
            )}
            <button
              onClick={() => router.push("/marketer/sliders/add")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm slider
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
                placeholder="Tìm theo tiêu đề..."
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
              value={isActiveFilter === undefined ? "" : isActiveFilter.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setIsActiveFilter(val === "" ? undefined : val === "true");
              }}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang hoạt động</option>
              <option value="false">Không hoạt động</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="order_asc">Thứ tự: Tăng dần</option>
              <option value="order_desc">Thứ tự: Giảm dần</option>
              <option value="title_asc">Tiêu đề: A → Z</option>
              <option value="title_desc">Tiêu đề: Z → A</option>
            </select>
          </div>
        </div>
      </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thứ tự</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSliders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Không tìm thấy slider nào
                    </td>
                  </tr>
                ) : (
                  filteredSliders.map((slider: SliderDto) => (
                    <tr
                      key={slider.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/marketer/sliders/detail/${slider.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-28 bg-gray-100 rounded-lg overflow-hidden">
                          {slider.imageUrl ? (
                            <img src={slider.imageUrl} alt={slider.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-300">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{slider.title}</div>
                        {slider.linkUrl && (
                          <div className="text-xs text-blue-500 truncate max-w-xs">{slider.linkUrl}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slider.order}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${slider.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {slider.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggle(slider); }}
                          className={`mr-3 ${slider.isActive ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}`}
                        >
                          {slider.isActive ? "Tắt" : "Bật"}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/marketer/sliders/update/${slider.id}`); }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Cập nhật
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(slider); }}
                          disabled={deleteSlider.isPending}
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
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Trước</button>
              <span className="text-sm text-gray-700">Trang {page} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">Sau</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
