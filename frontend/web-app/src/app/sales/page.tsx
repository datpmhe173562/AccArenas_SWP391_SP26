"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { format } from "date-fns";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SalesDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, chartData] = await Promise.all([
          salesService.getStats(),
          salesService.getCharts()
        ]);
        setStats(statsData);
        setCharts(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: "Doanh thu", value: stats?.totalRevenue ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue) : "-", color: "text-rose-600", sub: "Tổng tiền thực tế" },
    { label: "Số lượng đã bán", value: stats?.totalSold ?? "-", color: "text-blue-600", sub: "Tổng đơn thành công" },
    { label: "Tài khoản chưa bán", value: stats?.totalAvailableAccounts ?? "-", color: "text-emerald-500", sub: "Kho hàng hiện có" },
    { label: "Tài khoản đã bán", value: stats?.totalSoldAccounts ?? "-", color: "text-indigo-600", sub: "Tổng acc đã giao" },
    { label: "Đánh giá", value: stats?.averageRating ? `${stats.averageRating.toFixed(1)}/5` : "-", color: "text-amber-500", sub: `${stats?.feedbackCount || 0} phản hồi` },
    { label: "Khiếu nại", value: stats?.totalInquiries ?? "-", color: "text-rose-400", sub: "Hỗ trợ khách hàng" },
  ];

  const formatDay = (dateStr: string) => format(new Date(dateStr), "dd/MM");

  return (
    <SalesLayout>
      <div className="space-y-8 pb-10">
        <div className="relative overflow-hidden bg-indigo-900 rounded-[2rem] p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black mb-2 tracking-tight">Performance Overview</h1>
              <p className="text-indigo-100/80 font-medium text-lg">Hệ thống phân tích dữ liệu bán hàng AccArenas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Cập nhật lúc</div>
              <div className="text-xl font-bold">{format(new Date(), "HH:mm, dd/MM/yyyy")}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {cards.map((c) => (
                <div key={c.label} className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">{c.label}</p>
                  <p className={`text-3xl font-black tracking-tighter ${c.color}`}>
                    {c.value}
                  </p>
                  <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-1 opacity-70">
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    {c.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Status Performance (Horizontal Bar) */}
              <div className="lg:col-span-5 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Phân bổ trạng thái</h2>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={charts?.statusDistribution || []}
                      margin={{ left: 40, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="status" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 700 }}
                      />
                      <Tooltip 
                        cursor={{ fill: '#F9FAFB' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                        {(charts?.statusDistribution || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Trend (Area Chart) */}
              <div className="lg:col-span-7 bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Xu hướng doanh thu (7 ngày qua)</h2>
                </div>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts?.weeklyPerformance || []}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDay}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        formatter={(val: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val), 'Doanh thu']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4f46e5" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SalesLayout>
  );
}
