"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FulfillmentEventDto, SalesOrder } from "@/types/sales";
import { OrderItemDto } from "@/types/generated-api";
import { salesService } from "@/services/salesService";

export default function SalesOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [timeline, setTimeline] = useState<FulfillmentEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("Processing");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orders = await salesService.getAssignedOrders();
        const found = orders.find((o) => o.id === orderId) || null;
        setOrder(found);
        const tl = await salesService.getTimeline(orderId);
        setTimeline(tl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const statusOptions = useMemo(
    () => ["Processing", "Delivered", "Failed"],
    [],
  );

  const handleUpdateStatus = async () => {
    if (!order) return;
    setStatusLoading(true);
    try {
      const updated = await salesService.updateOrderStatus(
        order.id,
        newStatus,
        reason || undefined,
      );
      setOrder(updated);
      const tl = await salesService.getTimeline(order.id);
      setTimeline(tl);
      setReason("");
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!order || !note.trim()) return;
    setNoteLoading(true);
    try {
      const tl = await salesService.addFulfillmentNote(order.id, note);
      setTimeline(tl);
      setNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setNoteLoading(false);
    }
  };

  if (loading) {
    return (
      <SalesLayout>
        <div className="bg-white rounded-lg shadow p-6">Đang tải...</div>
      </SalesLayout>
    );
  }

  if (!order) {
    return (
      <SalesLayout>
        <div className="bg-white rounded-lg shadow p-6">
          Không tìm thấy đơn.
        </div>
      </SalesLayout>
    );
  }

  return (
    <SalesLayout>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Đơn #{order.id.split("-")[0]}
              </h1>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Trạng thái thanh toán: {order.status}
              </p>
              <p className="text-sm text-gray-500">
                Thực hiện: {order.fulfillmentStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Sản phẩm</h2>
            <div className="divide-y">
              {order.items.map((item: OrderItemDto) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.gameAccountName}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {item.gameAccountId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-800">
                      {item.price} {order.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end space-x-3 pt-3 border-t">
              <span className="text-sm text-gray-600">Tổng</span>
              <span className="text-lg font-semibold text-gray-900">
                {order.totalAmount} {order.currency}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Cập nhật trạng thái
            </h2>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Trạng thái mới</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">
                Lý do (nếu thất bại/ngoại lệ)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
              />
            </div>
            <button
              onClick={handleUpdateStatus}
              disabled={statusLoading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {statusLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>

            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm text-gray-600">Thêm ghi chú</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={noteLoading}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-900 disabled:opacity-50"
              >
                {noteLoading ? "Đang lưu..." : "Lưu ghi chú"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tiến trình</h2>
          </div>
          {timeline.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có sự kiện.</p>
          ) : (
            <div className="space-y-3">
              {timeline.map((evt) => (
                <div key={evt.id} className="border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {evt.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(evt.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {evt.note && (
                    <p className="text-sm text-gray-700 mt-1">{evt.note}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {evt.createdByName || evt.createdByUserId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SalesLayout>
  );
}
