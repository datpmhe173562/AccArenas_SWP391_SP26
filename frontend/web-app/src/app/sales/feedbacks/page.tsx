"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";
import { format } from "date-fns";

export default function SalesFeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await salesService.getFeedbacks();
                setFeedbacks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <SalesLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Phản hồi từ khách hàng</h1>
                    <p className="text-slate-500 font-medium">Xem đánh giá của khách hàng về các đơn hàng bạn đã xử lý</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {feedbacks.length === 0 ? (
                            <div className="md:col-span-2 bg-white rounded-2xl p-12 text-center text-slate-400 border border-dashed border-slate-200">
                                Chưa có phản hồi nào
                            </div>
                        ) : (
                            feedbacks.map((fb) => (
                                <div key={fb.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 capitalize">{fb.userName || fb.customerName || "Khách hàng"}</p>
                                            <p className="text-xs text-slate-500">Mã đơn: #{fb.orderId?.slice(0, 8) || "N/A"}</p>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {fb.createdAt ? format(new Date(fb.createdAt), "dd/MM/yyyy") : "N/A"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <svg 
                                                key={i} 
                                                className={`w-4 h-4 ${i < fb.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>

                                    <p className="text-slate-700 text-sm leading-relaxed italic">
                                        "{fb.comment || "Không có nội dung đánh giá"}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </SalesLayout>
    );
}
