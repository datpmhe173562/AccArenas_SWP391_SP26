"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchGameAccounts } from "@/hooks/useGameAccounts";
import { useCategories } from "@/hooks/useCategories";
import { GameAccountDto } from "@/types/generated-api";
import { GameAccountsList } from "./game-accounts-list";

interface SearchGameAccountsProps {
  onSelectAccount?: (gameAccount: GameAccountDto) => void;
}

export const SearchGameAccounts = ({
  onSelectAccount,
}: SearchGameAccountsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [isAvailable, setIsAvailable] = useState<boolean | undefined>();
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId, minPrice, maxPrice, isAvailable]);

  const { data: categoriesData } = useCategories(1, 100);

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useSearchGameAccounts(
    debouncedQuery || undefined,
    selectedCategoryId || undefined,
    minPrice,
    maxPrice,
    isAvailable,
    page,
    12,
    true, // enabled
  );

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setSelectedCategoryId("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setIsAvailable(undefined);
    setPage(1);
  }, []);

  const hasActiveFilters =
    searchQuery ||
    selectedCategoryId ||
    minPrice ||
    maxPrice ||
    isAvailable !== undefined;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Tìm kiếm Game Accounts
          </h2>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Search Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search Query */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên, mô tả, username..."
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
              {isSearching && (
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

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả categories</option>
              {categoriesData?.data?.data.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá tối thiểu
            </label>
            <input
              type="number"
              value={minPrice || ""}
              onChange={(e) =>
                setMinPrice(e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="0"
              min="0"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá tối đa
            </label>
            <input
              type="number"
              value={maxPrice || ""}
              onChange={(e) =>
                setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Không giới hạn"
              min="0"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={isAvailable === undefined ? "" : isAvailable.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setIsAvailable(value === "" ? undefined : value === "true");
              }}
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="true">Có sẵn</option>
              <option value="false">Đã bán</option>
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
              {selectedCategoryId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category:{" "}
                  {
                    categoriesData?.data?.data.find(
                      (c) => c.id === selectedCategoryId,
                    )?.name
                  }
                  <button
                    onClick={() => setSelectedCategoryId("")}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {(minPrice !== undefined || maxPrice !== undefined) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Giá: {minPrice || 0}đ - {maxPrice || "∞"}đ
                  <button
                    onClick={() => {
                      setMinPrice(undefined);
                      setMaxPrice(undefined);
                    }}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {isAvailable !== undefined && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Trạng thái: {isAvailable ? "Có sẵn" : "Đã bán"}
                  <button
                    onClick={() => setIsAvailable(undefined)}
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
        {searchError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Lỗi khi tìm kiếm: {searchError.message}
            </p>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            {searchResults && (
              <div className="mb-4 text-sm text-gray-600">
                Tìm thấy {searchResults.data?.totalCount || 0} kết quả
                {page > 1 &&
                  ` (Trang ${page}/${searchResults.data?.totalPages || 1})`}
              </div>
            )}

            {/* Custom GameAccountsList that handles search results */}
            <SearchResultsList
              searchResults={searchResults}
              isLoading={isSearching}
              page={page}
              onPageChange={setPage}
              onSelectAccount={onSelectAccount}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Custom component to display search results with pagination
interface SearchResultsListProps {
  searchResults: any;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onSelectAccount?: (gameAccount: GameAccountDto) => void;
}

const SearchResultsList = ({
  searchResults,
  isLoading,
  page,
  onPageChange,
  onSelectAccount,
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

  if (!searchResults?.data?.data || searchResults.data.data.length === 0) {
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
      {/* Mock the GameAccountsList structure but with search results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {searchResults.data.data.map((gameAccount: GameAccountDto) => (
          <div
            key={gameAccount.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={() => onSelectAccount?.(gameAccount)}
          >
            {/* Simplified game account card */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.797 1.599l2.5 1.875A2 2 0 008 9.816V15a1 1 0 102 0V9.816a2 2 0 002.703-.375l2.5-1.875A2 2 0 0016 6.816V5a2 2 0 00-2-2H4z" />
                </svg>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                {gameAccount.game}
              </h3>

              <p className="text-2xl font-bold text-green-600 mb-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(gameAccount.price)}
              </p>

              <p className="text-xs text-gray-500">
                {gameAccount.isAvailable ? (
                  <span className="text-green-600">● Có sẵn</span>
                ) : (
                  <span className="text-red-600">● Đã bán</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination for search results */}
      {searchResults?.data && searchResults.data.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          <span className="text-sm text-gray-700">
            Trang {page} / {searchResults.data.totalPages}
          </span>

          <button
            onClick={() =>
              onPageChange(Math.min(searchResults.data.totalPages, page + 1))
            }
            disabled={page === searchResults.data.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </>
  );
};
