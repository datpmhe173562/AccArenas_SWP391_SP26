"use client";

import { useOrderDetail } from "@/hooks/useOrders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { inquiryService } from "@/services/inquiryService";
import Swal from "sweetalert2";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrderDetail(id as string);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState("Vấn đề về đơn hàng");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchInquiries = async () => {
    if (!id) return;
    setLoadingInquiries(true);
    try {
      const data = await inquiryService.getInquiriesByOrder(id as string);
      setInquiries(data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchInquiries();
    }
  }, [id, isAuthenticated, authLoading]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Đã thanh toán</span>;
      case "pending":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Chờ thanh toán</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{status}</span>;
    }
  };

  const getInquiryStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Đang xử lý</span>;
      case "waitingcustomer":
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">Chờ bạn phản hồi</span>;
      case "closed":
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">Đã đóng</span>;
      default:
        return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const handleCreateInquiry = async () => {
    if (!inquiryMessage.trim()) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng nhập nội dung cần hỗ trợ' });
      return;
    }
    setSubmitting(true);
    try {
      await inquiryService.createInquiry(id as string, inquirySubject, inquiryMessage);
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Yêu cầu hỗ trợ đã được gửi. Chúng tôi sẽ phản hồi sớm nhất có thể!',
        timer: 3000,
        showConfirmButton: false
      });
      setInquiryModalOpen(false);
      setInquiryMessage("");
      fetchInquiries();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || "Không thể gửi yêu cầu hỗ trợ"
      });
    } finally {
      setSubmitting(false);
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
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/orders" 
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 font-medium mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại lịch sử đơn hàng
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error || !order ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-800 font-medium">Lỗi khi tải thông tin đơn hàng hoặc đơn hàng không tồn tại.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                  <h2 className="font-semibold text-gray-900">Sản phẩm đã mua</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src="https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png" 
                          alt={item.gameAccountName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.gameAccountName}</h3>
                          <div className="text-sm text-gray-500">Loại: Tài khoản game</div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-gray-500">Số lượng: {item.quantity}</div>
                          <div className="font-bold text-indigo-600">{formatCurrency(item.price)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Information Section (UC-11) */}
              {(order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'completed') && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-indigo-900">Thông tin tài khoản</h2>
                  </div>
                  <p className="text-indigo-800 text-sm mb-6">Thông tin chi tiết về tài khoản game đã được gửi tới email của bạn. Dưới đây là tóm tắt:</p>
                  <div className="bg-white rounded-xl border border-indigo-100 p-4 divide-y divide-indigo-50">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">{item.gameAccountName}</span>
                        <span className="text-indigo-600 italic">Vui lòng kiểm tra email của bạn</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support History (Inquiry history section) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Lịch sử hỗ trợ
                  </h2>
                  <button 
                    onClick={() => setInquiryModalOpen(true)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
                  >
                    Gửi yêu cầu mới
                  </button>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {loadingInquiries ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <p className="text-sm">Bạn chưa có yêu cầu hỗ trợ nào cho đơn hàng này.</p>
                    </div>
                  ) : (
                    inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="group">
                        <button 
                          onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                          className="w-full p-6 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-900">{inquiry.subject}</span>
                              {getInquiryStatusBadge(inquiry.status)}
                            </div>
                            <span className="text-xs text-gray-400">
                              Gửi ngày: {format(new Date(inquiry.createdAt), "dd/MM/yyyy HH:mm")}
                            </span>
                          </div>
                          <svg 
                            className={`w-5 h-5 text-gray-400 transition-transform ${expandedInquiry === inquiry.id ? 'rotate-180' : ''}`} 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedInquiry === inquiry.id && (
                          <div className="px-6 pb-6 bg-gray-50/50">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 max-h-[400px] overflow-y-auto mb-4">
                              {inquiry.messages.map((msg: any) => (
                                <div 
                                  key={msg.id} 
                                  className={`flex flex-col ${msg.senderRole === "Staff" || msg.senderRole === "Sales" ? "items-start" : "items-end"}`}
                                >
                                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.senderRole === "Staff" || msg.senderRole === "Sales"
                                      ? "bg-indigo-600 text-white rounded-tl-none" 
                                      : "bg-gray-100 text-gray-800 rounded-tr-none"
                                  }`}>
                                    <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                                  </div>
                                  <span className="text-[10px] text-gray-400 mt-1 px-1">
                                    {msg.senderRole === "Customer" ? "Bạn" : "CSKH"} • {format(new Date(msg.createdAt), "HH:mm dd/MM")}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {inquiry.status.toLowerCase() !== 'closed' && (
                              <div className="relative group">
                                <textarea 
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  placeholder="Nhập nội dung phản hồi..."
                                  rows={2}
                                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none"
                                />
                                <button 
                                  onClick={() => handleReply(inquiry.id)}
                                  disabled={replying || !replyMessage.trim()}
                                  className="absolute right-2 bottom-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                  <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50 text-xl">Tổng quan đơn hàng</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Trạng thái:</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày đặt hàng:</span>
                    <span className="text-gray-900 font-medium">
                      {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phương thức:</span>
                    <span className="text-gray-900 font-medium">VNPay</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sản phẩm ({order.items.length}):</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center mb-6">
                  <span className="font-bold text-gray-900">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-indigo-600">{formatCurrency(order.totalAmount)}</span>
                </div>

                {order.status.toLowerCase() === 'pending' && (
                  <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    Thanh toán ngay
                  </button>
                )}
              </div>

              {/* Need Help? Box */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Bạn cần hỗ trợ?</h3>
                <p className="text-sm text-gray-500 mb-6">Nếu có bất kỳ vấn đề gì về đơn hàng, vui lòng liên hệ với bộ phận CSKH của AccArenas.</p>
                <div className="space-y-3">
                  <button 
                    onClick={() => setInquiryModalOpen(true)}
                    className="w-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                  >
                    Chat với chúng tôi
                  </button>
                  <Link href="/support" className="block w-full text-center border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Trung tâm hỗ trợ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-md transition-all duration-300">
          <div className="bg-white/95 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-lg overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
            {/* Header with Gradient */}
            <div className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Gửi yêu cầu hỗ trợ</h3>
                  <p className="text-indigo-100 text-sm font-medium mt-1">Chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
                </div>
                <button 
                  onClick={() => setInquiryModalOpen(false)} 
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:rotate-90"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 bg-white">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                    Chủ đề hỗ trợ
                  </label>
                  <div className="relative">
                    <select 
                      value={inquirySubject}
                      onChange={(e) => setInquirySubject(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-slate-700 font-bold focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>Vấn đề về đơn hàng</option>
                      <option>Bảo hành tài khoản</option>
                      <option>Lỗi tài khoản/mật khẩu</option>
                      <option>Thông tin nạp thẻ</option>
                      <option>Khác</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                    Nội dung chi tiết
                  </label>
                  <textarea 
                    rows={4}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Vui lòng mô tả chi tiết vấn đề bạn đang gặp phải..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={handleCreateInquiry}
                  disabled={submitting}
                  className="group w-full relative h-14 bg-indigo-600 rounded-2xl overflow-hidden shadow-[0_10px_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:scale-105 transition-transform"></div>
                  <div className="relative flex items-center justify-center gap-3 text-white font-black text-lg">
                    {submitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Gửi yêu cầu ngay</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
                <p className="text-center text-xs text-slate-400 mt-4 font-medium italic">
                  * Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
