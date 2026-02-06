import MarketerLayout from "@/components/layout/MarketerLayout";
import { Suspense } from "react";

function PromotionsContent() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Quản lý Voucher
                </h1>
                <p className="text-gray-600">
                    Tạo và quản lý chương trình khuyến mãi
                </p>
            </div>

            {/* Create Promotion Form */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Tạo voucher mới
                </h2>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề voucher
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Nhập tiêu đề voucher"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã voucher
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Nhập mã voucher"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giảm giá (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số lượng
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày bắt đầu
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày kết thúc
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Nhập mô tả voucher"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            Tạo voucher
                        </button>
                    </div>
                </form>
            </div>

            {/* Promotions List */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Danh sách voucher
                </h2>
                <div className="text-center py-8 text-gray-500">
                    <p>Chưa có voucher nào được tạo</p>
                </div>
            </div>
        </div>
    );
}

export default function MarketerPromotionsPage() {
    return (
        <MarketerLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <PromotionsContent />
            </Suspense>
        </MarketerLayout>
    );
}