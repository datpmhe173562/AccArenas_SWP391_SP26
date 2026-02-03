import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Chào mừng đến với Trang Quản Trị
          </h1>
          <p className="text-gray-600">
            Quản lý toàn bộ hệ thống AccArenas từ đây
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sản phẩm</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thao tác nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <span></span>
              <div>
                <p className="font-medium text-gray-900">Quản lý người dùng</p>
                <p className="text-sm text-gray-500">Xem và quản lý users</p>
              </div>
            </a>

            <a
              href="/admin/products"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <span></span>
              <div>
                <p className="font-medium text-gray-900">Quản lý sản phẩm</p>
                <p className="text-sm text-gray-500">Thêm/sửa game accounts</p>
              </div>
            </a>

            <a
              href="/admin/promotions"
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <span></span>
              <div>
                <p className="font-medium text-gray-900">Quản lý khuyến mãi</p>
                <p className="text-sm text-gray-500">Tạo và quản lý voucher</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
