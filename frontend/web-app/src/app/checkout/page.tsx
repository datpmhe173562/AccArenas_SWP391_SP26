"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useGameAccount } from "@/hooks/useGameAccounts";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/orderService";
import { showError } from "@/lib/sweetalert";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { data: account, isLoading: accountLoading } = useGameAccount(id || "", !!id);
    
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`/auth/login?redirect=/checkout?id=${id}`);
        }
    }, [isAuthenticated, authLoading, router, id]);

    if (authLoading || accountLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Lỗi tải dữ liệu đơn hàng</h2>
                <button
                    onClick={() => router.push('/game-accounts')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    const handlePayment = async () => {
        if (!id) return;
        setIsProcessing(true);
        try {
            const paymentUrl = await orderService.createPayment({ gameAccountIds: [id] });
            window.location.href = paymentUrl;
        } catch (error: any) {
            showError(error.message || "Có lỗi xảy ra khi tạo thanh toán");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thanh toán đơn hàng</h1>
                
                <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-100 mb-8">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg leading-6 font-semibold text-gray-900">Chi tiết sản phẩm</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                            <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                <img 
                                    src={account.images?.[0] || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg'} 
                                    className="w-full h-full object-cover"
                                    alt={account.accountName}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg';
                                    }}
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{account.accountName}</h4>
                                <p className="text-gray-500 mb-3">{account.game}</p>
                                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold">
                                    Mã TK: #{account.id.split('-')[0].toUpperCase()}
                                </span>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-sm text-gray-500 mb-1">Tạm tính</div>
                                <div className="text-2xl font-bold text-gray-900">{formatCurrency(account.price)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                        <h3 className="text-lg leading-6 font-semibold text-gray-900">Tổng quan thanh toán</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Thành tiền:</span>
                            <span className="font-medium text-gray-900">{formatCurrency(account.price)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Phí giao dịch:</span>
                            <span className="font-medium text-green-600">Miễn phí</span>
                        </div>
                        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Tổng thanh toán:</span>
                            <span className="text-3xl font-bold text-pink-600">{formatCurrency(account.price)}</span>
                        </div>
                    </div>
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                        >
                            {isProcessing ? "Đang xử lý..." : "Thanh toán qua VNPay"}
                        </button>
                        <p className="text-center text-sm text-gray-500 mt-4">
                            Hệ thống sẽ chuyển hướng bạn đến cổng thanh toán VNPay an toàn tuyệt đối.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className="min-h-screen flex justify-center items-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <CheckoutContent />
            </Suspense>
            <Footer />
        </>
    );
}
