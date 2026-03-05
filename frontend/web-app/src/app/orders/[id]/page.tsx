"use client";

import { useOrderDetail } from "@/hooks/useOrders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading, error } = useOrderDetail(id as string);

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
              {order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'completed' ? (
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
              ) : null}
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
                  <button className="w-full border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Chat với chúng tôi
                  </button>
                  <button className="w-full border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Trung tâm hỗ trợ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
