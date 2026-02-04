import AdminLayout from "@/components/layout/AdminLayout";

export default function AssignRolePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gắn Vai Trò</h1>
          <p className="text-gray-600">Gán quyền và vai trò cho người dùng</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm người dùng
              </label>
              <input
                type="text"
                placeholder="Nhập email hoặc tên người dùng..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo vai trò
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách người dùng
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò hiện tại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Sample User Rows */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        A
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Admin User
                        </div>
                        <div className="text-sm text-gray-500">
                          admin@accarenas.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      Admin
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Chỉnh sửa
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        U
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          User Test
                        </div>
                        <div className="text-sm text-gray-500">
                          user@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      User
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Chỉnh sửa
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                        M
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Moderator
                        </div>
                        <div className="text-sm text-gray-500">
                          mod@accarenas.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Moderator
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Chỉnh sửa
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">1</span> đến{" "}
                <span className="font-medium">3</span> của{" "}
                <span className="font-medium">3</span> kết quả
              </div>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                  disabled
                >
                  Trước
                </button>
                <button className="px-3 py-1 text-sm text-white bg-indigo-600 rounded">
                  1
                </button>
                <button
                  className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                  disabled
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Role Management Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quản lý vai trò
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2"> Admin</h4>
              <p className="text-sm text-gray-600 mb-3">
                Quyền quản trị toàn hệ thống
              </p>
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                Quyền cao nhất
              </span>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2"> Moderator</h4>
              <p className="text-sm text-gray-600 mb-3">
                Quản lý nội dung và người dùng
              </p>
              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                Quyền trung gian
              </span>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2"> User</h4>
              <p className="text-sm text-gray-600 mb-3">
                Người dùng thông thường
              </p>
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Quyền cơ bản
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
