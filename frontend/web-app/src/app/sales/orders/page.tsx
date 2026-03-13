"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SalesOrder } from "@/types/sales";
import { salesService } from "@/services/salesService";

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await salesService.getAssignedOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const grouped = useMemo(() => {
    return orders.reduce<Record<string, SalesOrder[]>>((acc, o) => {
      const key = o.fulfillmentStatus || o.status;
      acc[key] = acc[key] || [];
      acc[key].push(o);
      return acc;
    }, {});
  }, [orders]);

  return (
    <SalesLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đơn được phân công
            </h1>
            <p className="text-gray-600">Theo dõi và xử lý đơn hàng của bạn</p>
          </div>
          <Link
            href="/sales/inquiries"
            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
          >
            Yêu cầu hỗ trợ
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            Chưa có đơn được phân công.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([status, list]) => (
              <div key={status} className="bg-white rounded-lg shadow">
                <div className="px-4 py-3 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {status}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {list.length} đơn
                    </span>
                  </div>
                </div>
                <div className="divide-y">
                  {list.map((order) => (
                    <Link
                      key={order.id}
                      href={`/sales/orders/${order.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          #{order.id.split("-")[0]}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-800">
                          {order.totalAmount} {order.currency}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SalesLayout>
  );
}
