"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/services/userService";
import { UserDto } from "@/types/generated-api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();

      if (response.success && response.data) {
        setUsers(response.data || []);
      } else if (Array.isArray(response)) {
        setUsers(response);
      } else {
        // @ts-ignore
        setUsers(response.data || response.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleViewDetail = (user: UserDto) => {
    router.push(`/admin/users/detail?id=${user.id}`);
  };

  const handleUpdate = (user: UserDto) => {
    router.push(`/admin/users/update?id=${user.id}`);
  };

  const handleToggleAccountStatus = async (user: UserDto) => {
    try {
      const action = user.isActive ? "khóa" : "mở khóa";
      // TODO: Implement API call để lock/unlock user
      console.log(`${action} tài khoản ${user.userName}`);

      // Update local state
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, isActive: !u.isActive } : u,
        ),
      );

      // fetchUsers(); // Uncomment when API is implemented
    } catch (error) {
      console.error("Không thể thay đổi trạng thái tài khoản", error);
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý người dùng
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Link href="/admin/users/add">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Thêm người dùng
              </button>
            </Link>
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Làm mới
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {user.userName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.userName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        {user.fullName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.roles?.join(", ") || "Customer"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Hoạt động" : "Đã khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetail(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        onClick={() => handleUpdate(user)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Cập nhật
                      </button>
                      <button
                        onClick={() => handleToggleAccountStatus(user)}
                        className={`${
                          user.isActive
                            ? "text-red-600 hover:text-red-900"
                            : "text-blue-600 hover:text-blue-900"
                        }`}
                      >
                        {user.isActive ? "Khóa TK" : "Mở TK"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
