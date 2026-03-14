"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { inquiryService } from "@/services/inquiryService";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import Swal from "sweetalert2";

export default function CustomerInquiriesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const data = await inquiryService.getMyInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchInquiries();
    }
  }, [isAuthenticated, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">Đang xử lý</span>;
      case "waitingcustomer":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">Chờ bạn phản hồi</span>;
      case "closed":
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">Đã đóng</span>;
      default:
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">{status}</span>;
    }
  };

  const handleReply = async (inquiryId: string) => {
    if (!replyMessage.trim()) return;
    setReplying(true);
    try {
      await inquiryService.replyInquiry(inquiryId, replyMessage);
      setReplyMessage("");
      fetchInquiries();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã gửi phản hồi',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || "Không thể gửi phản hồi"
      });
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Khiếu nại của tôi</h1>
          <p className="text-gray-500 font-medium">Theo dõi và quản lý các yêu cầu hỗ trợ của bạn</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khiếu nại nào</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Bạn hiện không có yêu cầu hỗ trợ nào đang hoạt động. Nếu cần giúp đỡ, hãy vào chi tiết đơn hàng để gửi yêu cầu.</p>
            <Link href="/orders" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
              Xem lịch sử đơn hàng
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div 
                  onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                  className="p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">{inquiry.subject}</h3>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                      <span>Mã khiếu nại: <span className="text-slate-900 font-bold">#{inquiry.id.substring(0, 8).toUpperCase()}</span></span>
                      <span>•</span>
                      <span>Ngày gửi: {format(new Date(inquiry.createdAt), "dd/MM/yyyy", { locale: vi })}</span>
                      <span>•</span>
                      <Link 
                        href={`/orders/${inquiry.orderId}`} 
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Xem đơn hàng #{inquiry.orderId.substring(0, 8).toUpperCase()}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Tin nhắn</p>
                      <p className="text-lg font-bold text-slate-900">{inquiry.messages.length}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-transform duration-300 ${expandedInquiry === inquiry.id ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedInquiry === inquiry.id && (
                  <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-6 max-h-[500px] overflow-y-auto mb-6 scrollbar-hide">
                      {inquiry.messages.map((msg: any) => (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col ${msg.senderRole === "Staff" || msg.senderRole === "Sales" ? "items-start" : "items-end"}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                            msg.senderRole === "Staff" || msg.senderRole === "Sales"
                              ? "bg-indigo-600 text-white rounded-tl-none" 
                              : "bg-white text-gray-800 rounded-tr-none border border-slate-100"
                          }`}>
                            <p className="font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 px-1">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              {msg.senderRole === "Customer" ? "Bạn" : "CSKH"}
                            </span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {format(new Date(msg.createdAt), "HH:mm, dd/MM/yyyy", { locale: vi })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {inquiry.status.toLowerCase() !== 'closed' && (
                      <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-xl group-focus-within:bg-indigo-500/10 transition-colors rounded-3xl"></div>
                        <div className="relative flex flex-col md:flex-row gap-4 p-2 bg-white rounded-3xl border-2 border-slate-100 focus-within:border-indigo-500 transition-all shadow-sm">
                          <textarea 
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Nhập nội dung phản hồi của bạn..."
                            rows={2}
                            className="flex-grow bg-transparent px-4 py-3 text-sm font-medium outline-none resize-none placeholder:text-slate-300"
                          />
                          <button 
                            onClick={() => handleReply(inquiry.id)}
                            disabled={replying || !replyMessage.trim()}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                          >
                            {replying ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <span>Gửi phản hồi</span>
                                <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
