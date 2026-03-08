"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { RoleService } from "@/services/roleService";
import { RoleDto } from "@/types/generated-api";
import { showSuccess, showError } from "@/lib/sweetalert";

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
      showSuccess("Cập nhật vai trò thành công!");
      router.push("/admin/roles");
    } catch (error: any) {
      console.error("Failed to update role", error);
      showError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật vai trò");
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
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại danh sách Role
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Cập nhật thông tin Role
        </h1>
        <p className="text-gray-500 mt-2">
            Thay đổi tên hoặc mô tả của nhóm quyền này.
        </p>
      </div>

      <div className="bg-white shadow-xl shadow-indigo-100/50 rounded-2xl border border-gray-100 p-8 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-gray-50/50 text-gray-900"
                placeholder="VD: Moderator"
              />
              <p className="mt-2 text-xs text-indigo-500 italic">
                Lưu ý: Thay đổi tên Role có thể ảnh hưởng đến quyền hạn của các tính năng dựa trên tên role.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả chi tiết
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none bg-gray-50/50 text-gray-900 resize-none"
                placeholder="Mô tả cụ thể quyền hạn của role này..."
              />
            </div>
            
            <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
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
