"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { RoleService } from "@/services/roleService";
import { RoleDto } from "@/types/generated-api";

function UpdateRoleContent() {
  const router = useRouter();
  const params = useParams();
  const idValue = params.id;
  const roleId = Array.isArray(idValue) ? idValue[0] : idValue;
  
  const [role, setRole] = useState<RoleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (roleId) {
      fetchRole(roleId);
    } else {
        router.push("/admin/roles");
    }
  }, [roleId]);

  const fetchRole = async (id: string) => {
    try {
      setLoading(true);
      const data = await RoleService.getRoleById(id);
      
      // Handle the case where the API returns the role directly or wrapped
      let roleData: RoleDto | null = null;
      if (data && typeof data === 'object') {
          if ('data' in data && data.data) {
             roleData = data.data as unknown as RoleDto;
          } else if ('id' in data) {
             roleData = data as unknown as RoleDto;
          }
      }

      if (roleData) {
        setRole(roleData);
        setFormData({ 
            name: roleData.name || "", 
            description: roleData.description || "" 
        });
      } else {
        alert("Không tìm thấy vai trò");
        router.push("/admin/roles");
      }
    } catch (error) {
      console.error("Failed to fetch role", error);
      alert("Lỗi khi tải thông tin vai trò");
      router.push("/admin/roles");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) return;

    setIsSubmitting(true);
    try {
      await RoleService.updateRole(roleId, formData);
      alert("Cập nhật vai trò thành công!");
      router.push("/admin/roles");
    } catch (error: any) {
      console.error("Failed to update role", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật vai trò");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/roles");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={handleCancel}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách Role
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Cập nhật thông tin Role
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên Role <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="VD: Moderator"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Lưu ý: Thay đổi tên Role có thể ảnh hưởng đến quyền hạn của người dùng hiện tại.
                    </p>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                    </label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Mô tả chi tiết về quyền hạn và trách nhiệm của role này..."
                    />
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
        </form>
      </div>
    </div>
  );
}

export default function UpdateRolePage() {
  return (
    <AdminLayout>
      <Suspense fallback={<div>Loading...</div>}>
         <UpdateRoleContent />
      </Suspense>
    </AdminLayout>
  );
}
