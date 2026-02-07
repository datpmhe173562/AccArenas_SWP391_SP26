"use client";

import { useState, useEffect } from "react";
import { UserService } from "@/services/userService";
import { UserDto } from "@/types/generated-api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import Pagination from "@/components/common/Pagination";

export default function UsersPage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter states
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();

      // response is already UserDto[] due to getAllUsers implementation
      const usersData: UserDto[] = Array.isArray(response) ? response : [];
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters and sorting
  const filteredUsers = users
    .filter((user) => {
      // Search filter
      const matchesSearch =
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole =
        selectedRole === "All" ||
        user.roles?.includes(selectedRole) ||
        (selectedRole === "Customer" && (!user.roles || user.roles.length === 0));

      // Status filter
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && user.isActive) ||
        (selectedStatus === "Inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      // Sorting logic
      let compareValue = 0;

      if (sortBy === "userName") {
        compareValue = (a.userName || "").localeCompare(b.userName || "");
      } else if (sortBy === "email") {
        compareValue = (a.email || "").localeCompare(b.email || "");
      } else if (sortBy === "createdAt") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        compareValue = dateA - dateB;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus, sortBy, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("All");
    setSelectedStatus("All");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

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
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Quản lý Người dùng
              </h1>
              <p className="text-gray-500 text-sm">
                Quản lý thông tin và phân quyền người dùng trong hệ thống
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/users/add">
                <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm người dùng
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter & Search Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Section - Takes up available space */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm người dùng
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập email, tên đăng nhập hoặc họ tên..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Filters Section - Fixed width or auto */}
            <div className="flex flex-col sm:flex-row gap-4">
               {/* Sort By */}
              <div className="min-w-[200px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sắp xếp theo
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order as "asc" | "desc");
                  }}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Ngày tạo (Mới nhất)</option>
                  <option value="createdAt-asc">Ngày tạo (Cũ nhất)</option>
                  <option value="userName-asc">Tên (A-Z)</option>
                  <option value="userName-desc">Tên (Z-A)</option>
                  <option value="email-asc">Email (A-Z)</option>
                  <option value="email-desc">Email (Z-A)</option>
                </select>
              </div>

               {/* Role Filter */}
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lọc theo vai trò
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="All">Tất cả vai trò</option>
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
                  <option value="SalesStaff">Sales Staff</option>
                  <option value="MarketingStaff">Marketing Staff</option>
                </select>
              </div>
              
               {/* Status Filter */}
                <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="All">Tất cả trạng thái</option>
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Đã khóa</option>
                </select>
              </div>
            </div>
          </div>
          
           {/* Active Filters Summary & Clear */}
           {(searchTerm || selectedRole !== "All" || selectedStatus !== "All") && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex gap-2 text-sm text-gray-600">
                    <span>Đang lọc:</span>
                    {searchTerm && <span className="bg-gray-100 px-2 py-0.5 rounded">Từ khóa: "{searchTerm}"</span>}
                    {selectedRole !== "All" && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">Vai trò: {selectedRole}</span>}
                    {selectedStatus !== "All" && <span className={`px-2 py-0.5 rounded ${selectedStatus === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>Trạng thái: {selectedStatus === 'Active' ? 'Hoạt động' : 'Đã khóa'}</span>}
                </div>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline"
                >
                  Xóa bộ lọc
                </button>
            </div>
           )}
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
                currentUsers.map((user) => (
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
          
          {/* Pagination */}
          {!loading && filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalItems={filteredUsers.length}
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
