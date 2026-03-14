"use client";

import { useEffect, useState } from "react";
import MarketerLayout from "@/components/layout/MarketerLayout";
import Link from "next/link";
import { DashboardService, MarketerStats } from "@/services/dashboardService";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function MarketerDashboard() {
    const [stats, setStats] = useState<MarketerStats>({
        totalProducts: 0,
        totalCategories: 0,
        totalVouchers: 0,
    });
    const [categoryData, setCategoryData] = useState<{ name: string; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch stats summary
                const statsData = await DashboardService.getMarketerStats();
                setStats(statsData);

                // Fetch category distribution
                const distribution = await DashboardService.getMarketerCategoryDistribution();
                setCategoryData(distribution);
            } catch (error) {
                console.error("Failed to fetch marketer dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
                            Tổng quan sản phẩm, danh mục và hiệu quả khuyến mãi
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

                {/* Category Distribution Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-gray-100 border-dashed gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                                <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
                                Phân bổ sản phẩm
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 font-medium">Tỷ lệ account game theo từng danh mục</p>
                        </div>
                    </div>

                    <div className="h-[400px] w-full mt-6">
                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                                        outerRadius={130}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value: any) => [`${value} sản phẩm`, "Số lượng"]}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <p>Không có dữ liệu danh mục</p>
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