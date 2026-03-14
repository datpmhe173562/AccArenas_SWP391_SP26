"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FulfillmentEventDto, SalesOrder } from "@/types/sales";
import { OrderItemDto } from "@/types/generated-api";
import { salesService } from "@/services/salesService";
import { useAuth } from "@/context/AuthContext";

export default function SalesOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { user } = useAuth();
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [timeline, setTimeline] = useState<FulfillmentEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("Processing");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const canUpdate = useMemo(() => {
    if (!user || !order) return false;
    return (
      user.roles.includes("Admin") || order.assignedToSalesId === user.id
    );
  }, [user, order]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderData = await salesService.getOrder(orderId);
        setOrder(orderData);
        if (orderData.status.toLowerCase() === "paid") {
           setNewStatus("Completed");
        }
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
    () => ["Processing", "Delivered", "Failed", "Completed"],
    [],
  );

  const handleUpdateStatus = async () => {
    if (!order || !canUpdate) return;
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
    if (!order || !note.trim() || !canUpdate) return;
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </SalesLayout>
    );
  }

  if (!order) {
    return (
      <SalesLayout>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng.</p>
        </div>
      </SalesLayout>
    );
  }

  return (
    <SalesLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Đơn #{order.id.split("-")[0].toUpperCase()}
              </h1>
              <p className="text-gray-400 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(order.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-right">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Thanh toán</p>
                <p className={`text-sm font-bold ${order.status.toLowerCase() === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.status}
                </p>
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-right">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-0.5">Phụ trách</p>
                <p className="text-sm font-bold text-gray-700">
                  {order.assignedSalesName || "Chưa có"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Sản phẩm đã mua
                </h2>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {order.items.map((item: OrderItemDto) => (
                    <div key={item.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
                          <img 
                            src="https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png" 
                            alt={item.gameAccountName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {item.gameAccountName}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">ID: {item.gameAccountId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-indigo-600">
                          {item.price.toLocaleString('vi-VN')} {order.currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Tổng giá trị đơn hàng</span>
                  <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                    {order.totalAmount.toLocaleString('vi-VN')} {order.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tiến trình xử lý
                </h2>
              </div>
              <div className="p-8">
                {timeline.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-gray-400 font-medium italic">Chưa có lịch sử sự kiện.</p>
                  </div>
                ) : (
                  <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-600 before:to-indigo-50">
                    {timeline.map((evt: FulfillmentEventDto) => (
                      <div key={evt.id} className="relative flex items-center justify-between md:justify-start md:space-x-10">
                        <div className="flex items-center md:absolute md:left-0 md:translate-x-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white ring-4 ring-indigo-50 shadow-sm">
                            <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                          </div>
                        </div>
                        <div className="ml-14 flex-grow bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all hover:-translate-y-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-black uppercase tracking-wider text-indigo-600">
                              {evt.status}
                            </span>
                            <span className="text-xs text-gray-400 font-bold bg-white px-3 py-1 rounded-full border border-gray-50 shadow-sm">
                              {new Date(evt.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          {evt.note && (
                            <p className="text-sm text-gray-700 font-medium leading-relaxed mb-3">
                              {evt.note}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                              {(evt.createdByName || 'S').charAt(0).toUpperCase()}
                            </div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                              {evt.createdByName || "System"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {canUpdate ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Công cụ quản lý
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cập nhật trạng thái</label>
                    <div className="relative group">
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm font-bold text-gray-700 outline-none transition-all appearance-none shadow-sm cursor-pointer"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Lý do thay đổi</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Nếu thất bại hoặc có lý do đặc biệt..."
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm font-medium text-gray-700 outline-none transition-all resize-none shadow-sm min-h-[100px]"
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={statusLoading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {statusLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Xác nhận cập nhật</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Ghi chú nội bộ</label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm font-medium text-gray-700 outline-none transition-all resize-none shadow-sm min-h-[100px]"
                      />
                    </div>
                    <button
                      onClick={handleAddNote}
                      disabled={noteLoading || !note.trim()}
                      className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-100 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                      {noteLoading ? "Đang lưu..." : "Lưu ghi chú"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-8">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                   <h2 className="font-bold text-gray-900 flex items-center gap-2 uppercase tracking-widest text-xs">
                    <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Chế độ xem tập trung
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <p className="text-yellow-800 text-sm font-bold leading-relaxed">
                      Bạn đang truy cập đơn hàng này ở chế độ chỉ xem.
                    </p>
                    <p className="text-yellow-700 text-xs mt-2 font-medium">
                      Quyền cập nhật chỉ dành cho người trực tiếp phụ trách hoặc quản trị viên.
                    </p>
                  </div>

                  {order.assignedSalesName ? (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Người đang phụ trách</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
                          {order.assignedSalesName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900">{order.assignedSalesName}</p>
                          <p className="text-[10px] text-indigo-600 font-bold tracking-wider">SALES SPECIALIST</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <p className="text-indigo-800 text-xs font-bold italic">
                        Đơn hàng này hiện chưa được phân phối cho nhân viên cụ thể hoặc được xử lý bởi hệ thống tự động.
                      </p>
                    </div>
                  )}

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tóm tắt tiến độ</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Thanh toán</span>
                        <span className="text-xs font-black text-green-600 uppercase tracking-tighter">{order.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500">Thực hiện</span>
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">{order.fulfillmentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SalesLayout>
  );
}
