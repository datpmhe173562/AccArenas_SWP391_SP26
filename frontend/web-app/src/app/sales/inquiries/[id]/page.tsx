"use client";

import SalesLayout from "@/components/layout/SalesLayout";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InquiryDto, SalesOrder } from "@/types/sales";
import { salesService } from "@/services/salesService";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function SalesInquiryDetailPage() {
  const params = useParams();
  const inquiryId = params?.id as string;
  const [inquiry, setInquiry] = useState<InquiryDto | null>(null);
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await salesService.getInquiry(inquiryId);
        setInquiry(data);
        if (data.orderId) {
          const o = await salesService.getOrder(data.orderId);
          setOrder(o);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (inquiryId) fetchData();
  }, [inquiryId]);

  const handleReply = async () => {
    if (!message.trim()) return;
    setReplying(true);
    try {
      const updated = await salesService.replyInquiry(
        inquiryId,
        message.trim(),
      );
      setInquiry(updated);
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setReplying(false);
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

  if (!inquiry) {
    return (
      <SalesLayout>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-500 font-medium">Không tìm thấy yêu cầu hỗ trợ.</p>
        </div>
      </SalesLayout>
    );
  }

  return (
    <SalesLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          <Link 
            href="/sales/inquiries" 
            className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{inquiry.subject}</h1>
            <p className="text-gray-400 font-medium text-sm">Khiếu nại ID: #{inquiry.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider ${
              inquiry.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
              inquiry.status === 'WaitingCustomer' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {inquiry.status === 'Resolved' ? 'Đã xử lý' : 
               inquiry.status === 'WaitingCustomer' ? 'Đợi khách phản hồi' : 'Đang xử lý'}
            </span>
            {inquiry.status !== 'Resolved' && (
              <button
                onClick={async () => {
                  try {
                    const updated = await salesService.updateInquiryStatus(inquiryId, 'Resolved');
                    setInquiry(updated);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-extrabold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95 flex items-center gap-2"
              >
                <span>Kết thúc khiếu nại</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Discussion Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Trao đổi chuyên môn
                </h2>
              </div>

              <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto bg-slate-50/30 scrollbar-hide">
                {inquiry.messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">Chưa có nội dung trao đổi.</p>
                  </div>
                ) : (
                  [...inquiry.messages].reverse().map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex flex-col ${m.senderRole === 'Sales' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm ${
                        m.senderRole === 'Sales' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                      }`}>
                        <p className="font-medium leading-relaxed whitespace-pre-line">{m.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 px-1">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                          {m.senderName || (m.senderRole === 'Customer' ? 'Khách hàng' : 'Nhân viên')}
                        </span>
                        <span className="text-[10px] text-gray-300">•</span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {new Date(m.createdAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-colors rounded-3xl"></div>
                  <div className="relative flex flex-col gap-4">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Phản hồi khách hàng tại đây..."
                      className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-all resize-none shadow-sm min-h-[120px]"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleReply}
                        disabled={replying || !message.trim()}
                        className="bg-indigo-600 text-white px-10 py-3.5 rounded-xl font-extrabold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center gap-2"
                      >
                        {replying ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Gửi phản hồi</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Order Evidence & Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Thông tin đơn hàng
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {order ? (
                  <>
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 group">
                          <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                            <img 
                              src="https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png" 
                              alt={item.gameAccountName} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate">{item.gameAccountName}</h4>
                            <p className="text-indigo-600 font-bold text-xs mt-1">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-100 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">Trạng thái đơn</span>
                        <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                          order.status.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">Ngày gửi yêu cầu</span>
                        <span className="text-gray-900 font-bold">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter text-[10px]">Tổng cộng</span>
                        <span className="text-indigo-600 font-extrabold text-sm">{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/sales/orders/${order.id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-all border border-slate-100"
                    >
                      Xem chi tiết đơn hàng
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm font-medium">Đang tải thông tin đơn...</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
              <h3 className="font-extrabold text-lg mb-2">Mẹo xử lý</h3>
              <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                Kiểm tra thông tin tài khoản trong chi tiết đơn hàng trước khi phản hồi để đảm bảo cung cấp đúng thông tin cho khách.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SalesLayout>
  );
}
