"use client";

import { useOrders } from "@/hooks/useOrders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function OrderHistoryPage() {
  const { data: orders, isLoading, error } = useOrders();

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
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-800 font-medium">Lỗi khi tải lịch sử đơn hàng. Vui lòng thử lại sau.</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Bạn chưa có đơn hàng nào</h2>
            <p className="text-gray-500 mb-8">Hãy khám phá các tài khoản game cực hot tại AccArenas ngay!</p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Mã đơn hàng: #{order.id.substring(0, 8).toUpperCase()}</div>
                      <div className="text-sm text-gray-500">
                        Ngày mua: {format(new Date(order.createdAt), "dd 'Tháng' M, yyyy", { locale: vi })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <Link 
                        href={`/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-100 px-4 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {/* We just show a placeholder or first item's image if available */}
                          <img 
                            src="https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png" 
                            alt="Order item" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">
                            {order.items.length > 1 
                              ? `${order.items[0].gameAccountName} và ${order.items.length - 1} sản phẩm khác` 
                              : order.items[0]?.gameAccountName || "Đơn hàng của tôi"}
                          </div>
                          <div className="text-sm text-gray-500">{order.items.length} sản phẩm</div>
                        </div>
                      </div>
                      <div className="text-right w-full md:w-auto">
                        <div className="text-sm text-gray-500 mb-1">Tổng cộng:</div>
                        <div className="text-xl font-bold text-indigo-600">{formatCurrency(order.totalAmount)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
