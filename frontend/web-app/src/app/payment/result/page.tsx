"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { orderService } from "@/services/orderService";
import { OrderDto } from "@/types/generated-api";

function PaymentResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const success = searchParams.get("success") === "true";
    const orderId = searchParams.get("orderId");
    const vnpResponseCode = searchParams.get("vnp_ResponseCode");

    const [order, setOrder] = useState<OrderDto | null>(null);
    const [loadingOrder, setLoadingOrder] = useState(true);

    useEffect(() => {
        if (orderId) {
            orderService.getOrderById(orderId)
                .then(setOrder)
                .catch(err => console.error("Error fetching order:", err))
                .finally(() => setLoadingOrder(false));
        } else {
            setLoadingOrder(false);
        }
    }, [orderId]);

    const getErrorMessage = (code: string | null) => {
        switch (code) {
            case "24": return "Giao dịch không thành công do: Khách hàng hủy giao dịch";
            case "11": return "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.";
            case "51": return "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.";
            case "65": return "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.";
            case "75": return "Ngân hàng thanh toán đang bảo trì.";
            case "79": return "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch";
            default: return "Giao dịch thất bại hoặc có lỗi xảy ra trong quá trình xử lý.";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-center">
                    <div className={`p-8 ${success ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-4">
                            {success ? (
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <h2 className="text-3xl font-bold">
                            {success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
                        </h2>
                    </div>
                    
                    <div className="p-8">
                        {success ? (
                            <div className="space-y-4">
                                <p className="text-lg text-gray-700">
                                    Cảm ơn bạn đã mua hàng tại AccArenas. Đơn hàng của bạn đã được xác nhận.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm border border-gray-100 mb-6">
                                    Mã đơn hàng: <span className="font-bold text-indigo-600">#{orderId}</span>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Thông tin tài khoản game đã được tự động gửi đến email của bạn. Bạn cũng có thể xem chi tiết trong mục Lịch sử đơn hàng.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-lg text-gray-700 font-medium text-red-600">
                                    {getErrorMessage(vnpResponseCode)}
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm border border-gray-100 mb-6">
                                    Mã giao dịch tham chiếu: <span className="font-bold text-gray-800">#{orderId || 'N/A'}</span>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Nếu bạn gặp bất kỳ vấn đề gì, vui lòng liên hệ bộ phận hỗ trợ khách hàng của chúng tôi để được giải đáp.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            {success ? (
                                <>
                                    <Link href="/orders" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                        Xem lịch sử đơn hàng
                                    </Link>
                                    <Link href="/" className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                                        Tiếp tục mua sắm
                                    </Link>
                                </>
                            ) : (
                                <>
                                     <Link 
                                        href={order?.items?.[0]?.gameAccountId ? `/checkout?id=${order.items[0].gameAccountId}` : "/game-accounts"} 
                                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        Thử thanh toán lại
                                    </Link>
                                    <Link href="/" className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
                                        Về trang chủ
                                    </Link>
                                </>
                            )}
                        </div>

                        {success && orderId && (
                           <div className="mt-12 pt-8 border-t border-gray-100">
                               <FeedbackSection orderId={orderId} />
                           </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeedbackSection({ orderId }: { orderId: string }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { feedbackService } = await import("@/services/feedbackService");
            await feedbackService.createFeedback({
                orderId,
                rating,
                comment
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 p-6 rounded-xl text-green-700 font-medium">
                Cảm ơn bạn đã gửi phản hồi! Ý kiến của bạn giúp chúng tôi hoàn thiện hơn.
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="text-left space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Đánh giá dịch vụ</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ hài lòng</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bình luận của bạn</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder="Chia sẻ trải nghiệm của bạn..."
                    required
                />
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition disabled:opacity-50"
            >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
        </form>
    );
}

export default function PaymentResultPage() {
    return (
        <>
            <Header />
            <Suspense fallback={
                <div className="min-h-screen flex justify-center items-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <PaymentResultContent />
            </Suspense>
            <Footer />
        </>
    );
}
