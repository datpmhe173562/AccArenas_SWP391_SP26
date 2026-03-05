"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { usePromotions } from "@/hooks/usePromotions";
import { PromotionQueryRequest } from "@/types/generated-api";

export default function PromotionsPage() {
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const query: PromotionQueryRequest = {
        isActive: true,
        page,
        pageSize
    };

    const { data: promotionsResult, isLoading } = usePromotions(query);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Khuyến mãi đang diễn ra</h1>
                        <p className="text-xl text-gray-600">Những ưu đãi tốt nhất dành cho bạn tại AccArenas</p>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : promotionsResult?.items?.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-400 mb-4 text-5xl">🎁</div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Hiện chưa có khuyến mãi nào</h3>
                            <p className="text-gray-500">Vui lòng quay lại sau để nhận những ưu đãi hấp dẫn nhé.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {promotionsResult?.items?.map((promo: any) => (
                                <div key={promo.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
                                        <div className="text-4xl font-black mb-2">{promo.discountPercent}% OFF</div>
                                        <div className="uppercase tracking-widest text-sm font-semibold opacity-90">Giảm giá</div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="bg-indigo-50 text-indigo-700 font-mono text-lg px-4 py-2 border border-indigo-100 border-dashed rounded font-bold tracking-wider">
                                                {promo.code}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-6 min-h-[48px]">
                                            {promo.description || `Giảm ${promo.discountPercent}% cho tất cả các giao dịch`}
                                        </p>
                                        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <div className="flex justify-between mb-1">
                                                <span>Bắt đầu:</span>
                                                <span className="font-medium text-gray-900">{new Date(promo.startDate).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Kết thúc:</span>
                                                <span className="font-medium text-pink-600">{new Date(promo.endDate).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {((promotionsResult?.totalPages) || 0) > 1 && (
                        <div className="mt-12 flex justify-center space-x-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-700 flex items-center">
                                Trang {page} / {promotionsResult?.totalPages || 1}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(promotionsResult?.totalPages || 1, p + 1))}
                                disabled={page === (promotionsResult?.totalPages || 1)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
