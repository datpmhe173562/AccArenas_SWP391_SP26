"use client";

import { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { UserService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { RoleService } from "@/services/roleService";
import { UserDto, RoleDto } from "@/types/generated-api";
import Swal from "sweetalert2";

export default function AssignRolePage() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        UserService.getUsers(page, pageSize, search),
        RoleService.getAllRoles(),
      ]);

      if (usersRes && usersRes.items) {
        setUsers(usersRes.items || []);
        setTotalCount(usersRes.totalCount || 0);
        setTotalPages(Math.ceil((usersRes.totalCount || 0) / pageSize));
      }

      if (Array.isArray(rolesRes)) {
        setRoles(rolesRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách người dùng hoặc vai trò',
      });
    } finally {
      setLoading(false);
    }
  };

  const { user: currentUser } = useAuth();
  
  // Combine assign/remove into change role (replace existing)
  const handleRoleChange = async (targetUserId: string, newRoleName: string, currentRoles: string[]) => {
    // 1. Check self-demotion
    if (currentUser?.id === targetUserId && currentRoles.includes("Admin") && newRoleName !== "Admin") {
      Swal.fire({
        icon: 'error',
        title: 'Không được phép',
        text: 'Admin không thể tự gỡ bỏ quyền Admin của chính mình.',
      });
      return;
    }

    try {
      setUpdatingUserId(targetUserId);
      
      // 2. Assign new role first (to ensure user always has a role)
      try {
        const assignRes = await UserService.assignRole({ userId: targetUserId, roleName: newRoleName });
        if (!assignRes.success) {
           throw new Error(assignRes.message || "Gán vai trò mới thất bại");
        }
      } catch (err: any) {
        // Check if error is "User already has this role" (400 Bad Request)
        // Axios error object structure: err.response.data
        const errorMessage = err.response?.data || err.message;
        if (typeof errorMessage === 'string' && errorMessage.includes("User already has this role")) {
           // This is fine, user already has the role, proceed to cleanup others.
           console.log("User already has role, proceeding to cleanup.");
        } else {
           throw err;
        }
      }

      // 3. Remove old roles (effectively "Changing" the role)
      // We filter out the new role just in case it was already there, 
      // but typically we just remove everything else.
      const rolesToRemove = currentRoles.filter(r => r !== newRoleName);
      
      for (const role of rolesToRemove) {
        await UserService.removeRole({ userId: targetUserId, roleName: role });
      }

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: `Đã thay đổi vai trò thành ${newRoleName}`,
        timer: 1500,
        showConfirmButton: false
      });

      // Update local state: Set strictly to the new role
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === targetUserId 
            ? { ...u, roles: [newRoleName] } 
            : u
        )
      );

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.message || "Có lỗi xảy ra khi thay đổi vai trò",
      });
      // Verification might be needed here, arguably we should refetch data to be safe
      fetchData(); 
    } finally {
      setUpdatingUserId(null);
    }
  };

  const [sortBy, setSortBy] = useState("name_asc");

  const filteredAndSortedUsers = useMemo(() => {
    // 1. Filter by Role (Client-side)
    let processed = users.filter(user => {
      // Search is now handled by backend, but we keep this just in case for immediate feedback 
      // or if we want to filter the current page further. 
      // Actually, if backend search is used, we should rely on it.
      // However, to be safe and consistent with "frontend side is ok", let's keep role filter here.
      return roleFilter === "" || user.roles.includes(roleFilter);
    });

    // 2. Sort (Client-side)
    processed.sort((a, b) => {
      const nameA = (a.fullName || a.userName || "").toLowerCase();
      const nameB = (b.fullName || b.userName || "").toLowerCase();
      const emailA = (a.email || "").toLowerCase();
      const emailB = (b.email || "").toLowerCase();

      switch (sortBy) {
        case "name_desc":
          return nameB.localeCompare(nameA);
        case "email_asc":
          return emailA.localeCompare(emailB);
        case "email_desc":
          return emailB.localeCompare(emailA);
        case "name_asc":
        default:
          return nameA.localeCompare(nameB);
      }
    });

    return processed;
  }, [users, roleFilter, sortBy]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gán Vai Trò</h1>
          <p className="text-gray-600">Gán quyền và vai trò cho người dùng trong hệ thống</p>
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
                placeholder="Nhập email, tên đăng nhập hoặc họ tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name_asc">Tên (A-Z)</option>
                <option value="name_desc">Tên (Z-A)</option>
                <option value="email_asc">Email (A-Z)</option>
                <option value="email_desc">Email (Z-A)</option>
              </select>
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo vai trò
              </label>
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tất cả vai trò</option>
                {roles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Danh sách người dùng ({filteredAndSortedUsers.length})
            </h3>
            {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>}
          </div>

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
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user.userName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName || user.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <span 
                              key={role}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {role}
                            </span>
                          ))}
                          {user.roles.length === 0 && (
                            <span className="text-xs text-gray-400 italic">Chưa có vai trò</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          disabled={updatingUserId === user.id}
                          value="" 
                          onChange={(e) => {
                            if (e.target.value) {
                              handleRoleChange(user.id, e.target.value, user.roles);
                            }
                          }}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="">Thay đổi vai trò...</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 rounded-b-lg shadow-sm mb-6 flex items-center justify-between">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Đang hiển thị <span className="font-medium">{(page - 1) * pageSize + 1}</span> đến <span className="font-medium">{Math.min(page * pageSize, totalCount)}</span> trong tổng số <span className="font-medium">{totalCount}</span> người dùng
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === i + 1
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>

        {/* Role Information Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Thông tin các vai trò trong hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map(role => (
              <div key={role.id} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{role.name}</h4>
                <p className="text-sm text-gray-600">
                  {role.description || "Không có mô tả"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
