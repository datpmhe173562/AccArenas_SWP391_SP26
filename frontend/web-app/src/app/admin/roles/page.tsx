import AdminLayout from "@/components/layout/AdminLayout";

export default function RolesPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quản lý Role
          </h1>
          <p className="text-gray-600">
            Tạo và quản lý các vai trò trong hệ thống
          </p>
        </div>

        {/* Role Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách Role
            </h3>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">
              Tạo Role mới
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Admin Role */}
            <div className="border border-gray-200 rounded-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-900">Admin</h4>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Cấp cao nhất
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Có toàn quyền quản trị hệ thống và tất cả các chức năng
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Quản lý người dùng
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Quản lý hệ thống
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Phân quyền
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Tất cả chức năng
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                  Chỉnh sửa
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>

            {/* Moderator Role */}
            <div className="border border-gray-200 rounded-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-900">
                    Moderator
                  </h4>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Cấp trung
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Quản lý nội dung và hỗ trợ người dùng trong hệ thống
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Quản lý sản phẩm
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Xem báo cáo cơ bản
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Hỗ trợ khách hàng
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Không có quyền Admin
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                  Chỉnh sửa
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>

            {/* User Role */}
            <div className="border border-gray-200 rounded-lg p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-900">User</h4>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Cơ bản
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                Người dùng thông thường với quyền truy cập cơ bản
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Mua bán tài khoản
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Xem sản phẩm
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Quản lý hồ sơ
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Không có quyền Admin
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                  Chỉnh sửa
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
