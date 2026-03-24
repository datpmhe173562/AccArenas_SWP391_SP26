"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";
import { SalesOrder } from "@/types/sales";
import Link from "next/link";
import { format } from "date-fns";

export default function SalesAllOrdersPage() {
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await salesService.getAllOrders();
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (order.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "processing": 
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "cancelled":
            case "refunded": return "bg-rose-100 text-rose-700 border-rose-200";
            case "paid": return "bg-indigo-100 text-indigo-700 border-indigo-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <SalesLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 mb-2">Lịch sử đơn hàng đã bán</h1>
                            <p className="text-slate-500 font-medium text-sm">Danh sách toàn bộ các đơn hàng đã được giao dịch thành công</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Tìm mã đơn, khách hàng..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
                                />
                                <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="paid">Đã thanh toán (Paid)</option>
                                <option value="cancelled">Đã hủy (Cancelled)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã đơn</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách hàng</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Tổng tiền</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                                {searchTerm || statusFilter !== "all" ? "Không tìm thấy kết quả phù hợp" : "Chưa có dữ liệu đơn hàng"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-sm text-slate-600">
                                                    #{order.id.slice(0, 8)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">
                                                    {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                                                    {order.userName || "Khách lẻ"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-900 font-black text-right">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                        {order.status.toLowerCase() === 'pending' ? 'Cancelled' : order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link 
                                                        href={`/sales/orders/${order.id}`}
                                                        className="text-indigo-600 hover:text-indigo-800 font-bold text-sm"
                                                    >
                                                        Chi tiết
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </SalesLayout>
    );
}
