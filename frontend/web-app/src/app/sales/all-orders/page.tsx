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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "delivered": return "bg-blue-100 text-blue-700 border-blue-200";
            case "processing": return "bg-amber-100 text-amber-700 border-amber-200";
            case "refunded": return "bg-rose-100 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <SalesLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Lịch sử đơn hàng đã bán</h1>
                    <p className="text-slate-500 font-medium">Danh sách toàn bộ các đơn hàng đã được giao dịch thành công</p>
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
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                                Chưa có dữ liệu đơn hàng
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
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
                                                        {order.status}
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
