"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState, useMemo } from "react";
import { salesService } from "@/services/salesService";
import { format } from "date-fns";

type SortOption = "newest" | "oldest" | "rating-high" | "rating-low";

export default function SalesFeedbacksPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState<number>(0); // 0 means All
    const [sortBy, setSortBy] = useState<SortOption>("newest");

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

    // Statistics Calculation
    const stats = useMemo(() => {
        if (!feedbacks.length) return { avg: 0, total: 0, counts: [0, 0, 0, 0, 0] };
        const total = feedbacks.length;
        const sum = feedbacks.reduce((a, b) => a + b.rating, 0);
        const avg = sum / total;
        const counts = [5, 4, 3, 2, 1].map(star => 
            feedbacks.filter(f => f.rating === star).length
        );
        return { avg, total, counts };
    }, [feedbacks]);

    // Filtering & Sorting Logic
    const displayFeedbacks = useMemo(() => {
        let result = [...feedbacks];
        
        if (filterRating > 0) {
            result = result.filter(f => f.rating === filterRating);
        }

        result.sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortBy === "rating-high") return b.rating - a.rating;
            if (sortBy === "rating-low") return a.rating - b.rating;
            return 0;
        });

        return result;
    }, [feedbacks, filterRating, sortBy]);

    const RatingStars = ({ rating, size = "w-4 h-4" }: { rating: number, size?: string }) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg 
                    key={i} 
                    className={`${size} ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    return (
        <SalesLayout>
            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Phản hồi khách hàng</h1>
                        <p className="text-slate-500 font-medium">Lắng nghe ý kiến người dùng để cải thiện dịch vụ</p>
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                        <span className="px-4 py-2 bg-white text-indigo-600 font-bold rounded-xl shadow-sm border border-slate-200">
                            {stats.total} Đánh giá
                        </span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-4">Đánh giá trung bình</p>
                        <div className="text-6xl font-black text-slate-900 mb-4">{stats.avg.toFixed(1)}</div>
                        <RatingStars rating={Math.round(stats.avg)} size="w-6 h-6" />
                        <p className="mt-4 text-slate-500 text-sm italic font-medium">Dựa trên {stats.total} lượt phản hồi</p>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <p className="text-slate-900 font-bold mb-6">Phân bổ đánh giá</p>
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star, idx) => (
                                <div key={star} className="flex items-center gap-4">
                                    <div className="w-12 text-sm font-bold text-slate-500 whitespace-nowrap">{star} sao</div>
                                    <div className="flex-1 h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                        <div 
                                            className="h-full bg-amber-400 rounded-full transition-all duration-1000" 
                                            style={{ width: `${stats.total ? (stats.counts[idx] / stats.total) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-sm font-bold text-slate-900 text-right">{stats.counts[idx]}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                        <button 
                            onClick={() => setFilterRating(0)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filterRating === 0 ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                        >
                            Tất cả
                        </button>
                        {[5, 4, 3, 2, 1].map(star => (
                            <button 
                                key={star}
                                onClick={() => setFilterRating(star)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${filterRating === star ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                            >
                                {star} <span className="text-amber-400">★</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-slate-400 whitespace-nowrap">Sắp xếp:</label>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="rating-high">Đánh giá cao</option>
                            <option value="rating-low">Đánh giá thấp</option>
                        </select>
                    </div>
                </div>

                {/* Feedback List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="text-slate-400 font-bold animate-pulse">Đang tải phản hồi...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayFeedbacks.length === 0 ? (
                            <div className="md:col-span-2 lg:col-span-3 bg-white rounded-3xl p-24 text-center border-2 border-dashed border-slate-100">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy phản hồi</h3>
                                <p className="text-slate-400 font-medium">Hãy thử thay đổi bộ lọc hoặc quay lại sau</p>
                            </div>
                        ) : (
                            displayFeedbacks.map((fb) => (
                                <div key={fb.id} className="group bg-white rounded-3xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-sm uppercase">
                                                {(fb.userName || fb.customerName || "K")?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 capitalize">{fb.userName || fb.customerName || "Khách hàng"}</p>
                                                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Mã đơn: #{fb.orderId?.slice(0, 8) || "N/A"}</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                                            {fb.createdAt ? format(new Date(fb.createdAt), "dd/MM/yyyy") : "N/A"}
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <RatingStars rating={fb.rating} />
                                    </div>

                                    <div className="flex-1 relative">
                                        <svg className="absolute -top-2 -left-2 w-6 h-6 text-slate-50 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21C14.017 19.8954 14.9124 19 16.017 19H19.017C20.1216 19 21.017 19.8954 21.017 21V23M3.01697 21L3.01697 18C3.01697 16.8954 3.91241 16 5.01697 16H8.01697C9.12154 16 10.017 16.8954 10.017 18V21C10.017 22.1046 9.12154 23 8.01697 23H5.01697C3.91241 23 3.01697 22.1046 3.01697 21ZM3.01697 21C3.01697 19.8954 3.91241 19 5.01697 19H8.01697C9.12154 19 10.017 19.8954 10.017 21V23" />
                                        </svg>
                                        <p className="text-slate-600 text-sm leading-relaxed italic relative z-10 pl-2">
                                            {fb.comment || "Không có nội dung đánh giá"}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-8 pt-4 border-t border-slate-50 flex justify-end">
                                        <button className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                                            Phản hồi khách hàng →
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </SalesLayout>
    );
}
