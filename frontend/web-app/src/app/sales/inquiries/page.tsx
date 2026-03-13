"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { InquiryDto } from "@/types/sales";
import { salesService } from "@/services/salesService";

export default function SalesInquiriesPage() {
  const [items, setItems] = useState<InquiryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await salesService.getInquiries();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SalesLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Yêu cầu hỗ trợ
          </h1>
          <p className="text-gray-600">
            Trao đổi với khách hàng cho các đơn bạn phụ trách
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">Chưa có yêu cầu.</div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y">
            {items.map((inq) => (
              <Link
                key={inq.id}
                href={`/sales/inquiries/${inq.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {inq.subject}
                  </p>
                  <p className="text-xs text-gray-500">
                    Đơn #{inq.orderId.split("-")[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(inq.createdAt).toLocaleString()}
                  </p>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {inq.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SalesLayout>
  );
}
