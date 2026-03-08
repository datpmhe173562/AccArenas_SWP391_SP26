"use client";

import { useEffect, useState } from "react";
import MarketerLayout from "@/components/layout/MarketerLayout";
import Link from "next/link";
import { DashboardService, MarketerStats, RevenueChartData } from "@/services/dashboardService";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfMonth, endOfMonth } from "date-fns";

export default function MarketerDashboard() {
    const [stats, setStats] = useState<MarketerStats>({
        totalProducts: 0,
        totalCategories: 0,
        totalVouchers: 0,
    });
    const [chartData, setChartData] = useState<RevenueChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats sumary
                const statsData = await DashboardService.getMarketerStats();
                setStats(statsData);

                // Fetch chart data based on selected month
                const [year, month] = selectedMonth.split("-");
                const startDate = startOfMonth(new Date(Number(year), Number(month) - 1));
                const endDate = endOfMonth(new Date(Number(year), Number(month) - 1));
                
                const formattedStart = format(startDate, "yyyy-MM-dd");
                const formattedEnd = format(endDate, "yyyy-MM-dd");

                const chartStats = await DashboardService.getMarketerRevenueChart(formattedStart, formattedEnd);
                setChartData(chartStats);
            } catch (error) {
                console.error("Failed to fetch marketer dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedMonth]);

    // Format currency for chart tooltip
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Format date for chart XAxis
    const formatDay = (dateStr: string) => {
        return format(new Date(dateStr), "dd/MM");
    };

    return (
        <MarketerLayout>
            <div className="space-y-8 pb-10">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                            Dashboard Marketing 
                        </h1>
                        <p className="text-gray-600 font-medium tracking-tight">
                            Tổng quan sản phẩm, danh mục và doanh thu chiến dịch
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng sản phẩm</p>
                                <p className="text-4xl font-black text-gray-900">
                                    {loading ? "..." : stats.totalProducts}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs font-semibold tracking-tight text-blue-600 bg-blue-50 py-2 px-4 rounded-lg inline-block self-start">
                            Tài khoản game hiện hành
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 opacity-50"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng danh mục</p>
                                <p className="text-4xl font-black text-gray-900">
                                    {loading ? "..." : stats.totalCategories}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs font-semibold tracking-tight text-emerald-600 bg-emerald-50 py-2 px-4 rounded-lg inline-block self-start">
                            Phân loại đang hỗ trợ
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10 opacity-50"></div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng Voucher</p>
                                <p className="text-4xl font-black text-gray-900">
                                    {loading ? "..." : stats.totalVouchers}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs font-semibold tracking-tight text-purple-600 bg-purple-50 py-2 px-4 rounded-lg inline-block self-start">
                            Mã khuyến mãi đang cấp
                        </div>
                    </div>
                </div>

                {/* Revenue Chart Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-gray-100 border-dashed gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
                                Biểu đồ doanh thu
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Theo dõi tăng trưởng doanh số của sàn</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200 shadow-inner">
                            <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <input 
                                type="month" 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-transparent border-none text-sm font-bold text-gray-700 outline-none pr-3 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="h-[350px] w-full mt-6">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis 
                                        dataKey="date" 
                                        tickFormatter={formatDay}
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}k`}
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                                        dx={-10}
                                    />
                                    <Tooltip 
                                        formatter={(value: any) => [formatCurrency(value as number), "Doanh thu"]}
                                        labelFormatter={(label) => `Ngày ${formatDay(label)}`}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', fontWeight: 600 }}
                                        itemStyle={{ color: '#4f46e5', fontWeight: 800 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="#4f46e5" 
                                        strokeWidth={3}
                                        fillOpacity={1} 
                                        fill="url(#colorRevenue)" 
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                <p>Không có dữ liệu trong tháng này</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                        <span className="w-2 h-6 bg-pink-500 rounded-full inline-block"></span>
                        Thao tác nhanh
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <Link href="/marketer/products/add" className="group p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all block relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Thêm sản phẩm</p>
                                    <p className="text-xs font-semibold text-gray-500 mt-1">Tạo mới account 🎮</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/marketer/categories" className="group p-5 bg-white border border-gray-200 rounded-2xl hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all block relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">QL Danh mục</p>
                                    <p className="text-xs font-semibold text-gray-500 mt-1">Thêm dòng game 🕹️</p>
                                </div>
                            </div>
                        </Link>

                        <Link href="/marketer/promotions/add" className="group p-5 bg-white border border-gray-200 rounded-2xl hover:border-pink-300 hover:shadow-lg hover:shadow-pink-50 transition-all block relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Tạo Voucher</p>
                                    <p className="text-xs font-semibold text-gray-500 mt-1">Mã giảm giá mới 🏷️</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </MarketerLayout>
    );
}