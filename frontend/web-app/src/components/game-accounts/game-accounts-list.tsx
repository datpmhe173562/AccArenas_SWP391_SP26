"use client";

import { useState } from "react";
import {
  useGameAccounts,
  useGameAccountsByCategory,
  useDeleteGameAccount,
} from "@/hooks/useGameAccounts";
import { useCategories } from "@/hooks/useCategories";
import { GameAccountDto, CategoryDto } from "@/types/generated-api";

interface GameAccountsListProps {
  categoryId?: string;
  onEdit?: (gameAccount: GameAccountDto) => void;
  onViewDetails?: (gameAccount: GameAccountDto) => void;
}

export const GameAccountsList = ({
  categoryId,
  onEdit,
  onViewDetails,
}: GameAccountsListProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Use different query based on categoryId
  const gameAccountsQuery = categoryId
    ? useGameAccountsByCategory(categoryId, page, pageSize)
    : useGameAccounts(page, pageSize);

  const {
    data: gameAccountsData,
    isLoading,
    error,
    refetch,
  } = gameAccountsQuery;

  const { data: categoriesData } = useCategories(1, 100);
  const deleteGameAccount = useDeleteGameAccount();

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa game account này?")) {
      return;
    }

    try {
      await deleteGameAccount.mutateAsync(id);
      refetch();
    } catch (error) {
      console.error("Error deleting game account:", error);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categoriesData?.items?.find(
      (c: CategoryDto) => c.id === categoryId,
    );
    return category?.name || "Unknown Category";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.833 3.924 20.5 5.464 20.5z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-red-800">
            Lỗi khi tải game accounts
          </h3>
          <p className="mt-1 text-red-600">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const gameAccounts = Array.isArray(gameAccountsData) 
    ? gameAccountsData 
    : [];
  
  // Client-side pagination since backend doesn't support it yet
  const totalCount = gameAccounts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedAccounts = gameAccounts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {categoryId
              ? `Game Accounts - ${getCategoryName(categoryId)}`
              : "All Game Accounts"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng cộng: {totalCount} game accounts
          </p>
        </div>
      </div>

      {/* Game Accounts Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game / Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedAccounts.map((gameAccount) => (
              <tr key={gameAccount.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
                      {gameAccount.images && gameAccount.images.length > 0 ? (
                        <img
                          src={gameAccount.images[0]}
                          alt={gameAccount.game}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 3a2 2 0 00-2 2v1.816a2 2 0 00.797 1.599l2.5 1.875A2 2 0 008 9.816V15a1 1 0 102 0V9.816a2 2 0 002.703-.375l2.5-1.875A2 2 0 0016 6.816V5a2 2 0 00-2-2H4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {gameAccount.game}
                      </div>
                      <div className="text-sm text-gray-500">
                        {gameAccount.accountName}
                      </div>
                      {gameAccount.rank && (
                        <div className="text-xs text-gray-400">
                          Rank: {gameAccount.rank}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getCategoryName(gameAccount.categoryId)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(gameAccount.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      gameAccount.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {gameAccount.isAvailable ? "Có sẵn" : "Đã bán"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(gameAccount.createdAt || "").toLocaleDateString(
                    "vi-VN"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {onViewDetails && (
                    <button
                      onClick={() => onViewDetails(gameAccount)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Chi tiết
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(gameAccount)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Sửa
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(gameAccount.id)}
                    disabled={deleteGameAccount.isPending}
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

      {/* Empty State */}
      {gameAccounts.length === 0 && (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {categoryId
              ? "Chưa có game accounts cho category này"
              : "Chưa có game accounts"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Bắt đầu bằng cách tạo game account đầu tiên của bạn.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          <span className="text-sm text-gray-700">
            Trang {page} / {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages || 1, p + 1),
              )
            }
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};
