"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/services/userService";
import { UserDto } from "@/types/generated-api";
import { useRouter } from "next/navigation";
import { 
  showSuccess, 
  showError, 
} from "@/lib/sweetalert";
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
      
      if (response.success && response.result) { 
         setUsers(response.result || []); 
      } else if (Array.isArray(response)) {
          setUsers(response);
      } else {
        // @ts-ignore
        setUsers(response.data || response.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      showError("Không thể tải danh sách người dùng", "Lỗi hệ thống");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      await UserService.deleteUser(id);
      showSuccess("Đã xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      showError("Không thể xóa người dùng", "Lỗi");
    }
  };

  return (
    <AdminLayout>
      <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <div className="flex gap-4">
            <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">Đang tải...</td>
                </tr>
            ) : filteredUsers.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">Không tìm thấy người dùng nào</td>
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
                                    <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phoneNumber || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {user.roles?.join(', ') || 'Customer'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                                {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-900 ml-4"
                            >
                                Xóa
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
