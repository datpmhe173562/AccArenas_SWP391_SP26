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
      <div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Quản lý người dùng
            </h1>
            <div className="flex gap-2">
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

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 min-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="Admin">Admin</option>
              <option value="Customer">Customer</option>
              <option value="SalesStaff">Sales Staff</option>
              <option value="MarketingStaff">Marketing Staff</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Đã khóa</option>
            </select>

            {/* Sort By */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="createdAt-desc">Ngày tạo (Mới nhất)</option>
              <option value="createdAt-asc">Ngày tạo (Cũ nhất)</option>
              <option value="userName-asc">Tên (A-Z)</option>
              <option value="userName-desc">Tên (Z-A)</option>
              <option value="email-asc">Email (A-Z)</option>
              <option value="email-desc">Email (Z-A)</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Xóa bộ lọc
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
