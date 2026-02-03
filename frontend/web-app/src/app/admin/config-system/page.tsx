import AdminLayout from "@/components/layout/AdminLayout";

export default function ConfigSystemPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Config System
          </h1>
          <p className="text-gray-600">Cấu hình các thông số hệ thống</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Cài đặt hệ thống
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Quản lý các cài đặt cơ bản của hệ thống
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Bảo trì hệ thống</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                  Hoạt động
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Cache hệ thống</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                  Đã bật
                </span>
              </div>
            </div>
          </div>

          {/* Application Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Cài đặt ứng dụng
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Cấu hình các tính năng của ứng dụng
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Đăng ký mới</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                  Cho phép
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Email xác thực</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded">
                  Bắt buộc
                </span>
              </div>
            </div>
          </div>

          {/* Database Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Cài đặt cơ sở dữ liệu
              </h2>
            </div>
            <p className="text-gray-600 mb-4">Quản lý cấu hình cơ sở dữ liệu</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Kết nối DB</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                  Kết nối thành công
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Backup tự động</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                  Hàng ngày
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Cài đặt bảo mật
              </h2>
            </div>
            <p className="text-gray-600 mb-4">Cấu hình các tính năng bảo mật</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Two-Factor Auth</span>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded">
                  Tùy chọn
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Session timeout</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  30 phút
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Hành động nhanh
            </h3>
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Đặt lại cấu hình
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
