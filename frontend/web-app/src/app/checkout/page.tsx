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
import { isCustomer } from "@/lib/roleUtils";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id");

    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { data: account, isLoading: accountLoading } = useGameAccount(id || "", !!id);
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
    const [voucherCode, setVoucherCode] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<{ code: string, discountPercent: number } | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push(`/auth/login?redirect=/checkout?id=${id}`);
            } else if (!isCustomer(user)) {
                // Not a customer, can't buy
                showError("Chức năng mua hàng chỉ dành cho tài khoản Khách hàng.");
                router.push('/');
            }
        }
    }, [isAuthenticated, authLoading, user, router, id]);

    // Handle back button / leave page alert
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isProcessing) {
                e.preventDefault();
                e.returnValue = "Bạn có muốn hủy giao dịch không?";
                return e.returnValue;
            }
        };

        const handlePopState = async (e: PopStateEvent) => {
            if (isProcessing) {
                if (window.confirm("Bạn có muốn hủy giao dịch không?")) {
                    if (activeOrderId) {
                        try {
                            await orderService.cancelOrder(activeOrderId);
                            setIsProcessing(false);
                        } catch (err) {
                            console.error("Lỗi khi hủy đơn hàng:", err);
                        }
                    }
                    // Allow navigation
                } else {
                    // Push state back to prevent navigation
                    window.history.pushState(null, "", window.location.href);
                }
            }
        };

        if (isProcessing) {
            window.history.pushState(null, "", window.location.href);
            window.addEventListener("popstate", handlePopState);
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
        
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [isProcessing, activeOrderId]);

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        setIsValidating(true);
        try {
            const res = await (await import("@/services/promotionService")).promotionService.validatePromotionCode(voucherCode);
            if (res.isValid && res.promotion) {
                setAppliedVoucher({
                    code: res.promotion.code,
                    discountPercent: res.promotion.discountPercent
                });
                import("@/lib/sweetalert").then(m => m.showSuccess("Áp dụng mã giảm giá thành công!"));
            } else {
                import("@/lib/sweetalert").then(m => m.showError(res.message || "Mã giảm giá không hợp lệ"));
                setAppliedVoucher(null);
            }
        } catch (error) {
            import("@/lib/sweetalert").then(m => m.showError("Lỗi hệ thống khi kiểm tra mã giảm giá"));
            setAppliedVoucher(null);
        } finally {
            setIsValidating(false);
        }
    };

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
            const { orderId, paymentUrl } = await orderService.createPayment({ 
                gameAccountIds: [id],
                promotionCode: appliedVoucher?.code
            });
            setActiveOrderId(orderId);
            window.location.href = paymentUrl;
        } catch (error: any) {
            showError(error.message || "Có lỗi xảy ra khi tạo thanh toán");
            setIsProcessing(false);
        }
    };

    const discountAmount = appliedVoucher ? (account.price * appliedVoucher.discountPercent / 100) : 0;
    const finalTotal = account.price - discountAmount;

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
                        {appliedVoucher && (
                            <div className="flex justify-between text-pink-600">
                                <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1.115.992l1.115.008zm3-1a1 1 0 11-1 1h1V5z" clipRule="evenodd" /><path d="M9 11H4v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-5v7z" /></svg>
                                    Giảm giá ({appliedVoucher.code}):
                                </span>
                                <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Phí giao dịch:</span>
                            <span className="font-medium text-green-600">Miễn phí</span>
                        </div>
                        
                        <div className="pt-4 mt-6 border-t border-gray-100 flex flex-col gap-4">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Nhập mã giảm giá..." 
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none uppercase text-sm font-bold"
                                />
                                <button 
                                    onClick={handleApplyVoucher}
                                    disabled={isValidating || !voucherCode.trim()}
                                    className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors disabled:opacity-50"
                                >
                                    {isValidating ? "Đang check..." : "Áp dụng"}
                                </button>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Tổng thanh toán:</span>
                                <span className="text-3xl font-bold text-pink-600">{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="px-6 py-6 bg-gray-50 border-t border-gray-100">
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
                        >
                            {isProcessing ? "Đang xử lý..." : "Thanh toán"}
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
