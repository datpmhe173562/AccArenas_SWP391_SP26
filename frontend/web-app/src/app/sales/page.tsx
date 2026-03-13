"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState } from "react";
import { salesService } from "@/services/salesService";

export default function SalesDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await salesService.getStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Tổng đơn", value: stats?.totalOrders ?? "-" },
    { label: "Đang xử lý", value: stats?.processing ?? "-" },
    { label: "Đã giao", value: stats?.delivered ?? "-" },
    { label: "Thất bại", value: stats?.failed ?? "-" },
    { label: "Doanh thu đã giao", value: stats?.revenueDelivered ?? "-" },
  ];

  return (
    <SalesLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard Sales
          </h1>
          <p className="text-gray-600">Theo dõi hiệu suất cá nhân</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-2">
                  {c.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SalesLayout>
  );
}
