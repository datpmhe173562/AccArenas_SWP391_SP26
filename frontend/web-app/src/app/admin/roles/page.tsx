"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";
import { RoleService } from "@/services/roleService";
import { RoleDto } from "@/types/generated-api";
import { showSuccess, showError, showConfirm } from "@/lib/sweetalert";

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      // Use getAllRoles for the full list since roles are usually few
      const data = await RoleService.getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Failed to fetch roles", error);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await showConfirm(`Bạn có chắc chắn muốn xóa vai trò "${name}" không?`, "Xác nhận xóa");
    if (!isConfirmed) return;
    
    try {
      await RoleService.deleteRole(id);
      showSuccess("Xóa vai trò thành công");
      await fetchRoles();
    } catch (error: any) {
        console.error("Failed to delete role", error);
        
        // Handle specific "assigned to users" error from backend
        // Standardize getting the error message
        let errorMessage = "Không thể xóa vai trò này";
        
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail;
        } else if (error.message) {
            errorMessage = error.message;
        }

        // Use alert for now, can upgrade to Swal if installed
        showError(`Lỗi: ${errorMessage}`);
    }
  };

  // Helper to determine badge color based on role name
  const getRoleBadgeColor = (roleName?: string) => {
    const name = roleName?.toLowerCase() || "";
    if (name.includes("admin")) return "bg-red-100 text-red-800";
    if (name.includes("mod") || name.includes("staff")) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Quản lý Role
              </h1>
              <p className="text-gray-500 text-sm">
                Tạo và quản lý các nhóm quyền hạn trong hệ thống
              </p>
            </div>
            <Link 
              href="/admin/roles/add"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo Role mới
            </Link>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : roles.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Chưa có vai trò nào được tạo</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <div key={role.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(role.name)}`}>
                                    {role.name}
                                </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 min-h-[40px] line-clamp-2">
                                {role.description || "Chưa có mô tả"}
                            </p>
                            
                            <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                                <Link
                                    href={`/admin/roles/update/${role.id}`}
                                    className="flex-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors text-center block"
                                >
                                    Chỉnh sửa
                                </Link>
                                <button
                                    onClick={() => handleDelete(role.id, role.name || "")}
                                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
