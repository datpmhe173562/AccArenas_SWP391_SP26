"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { AuditLogService, AuditLogDto } from "@/services/auditLogService";
import { format } from "date-fns";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLogDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [entityTypeFilter, setEntityTypeFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1); // Reset page when filters change
    }, [debouncedSearch, actionFilter, entityTypeFilter, roleFilter]);

    useEffect(() => {
        fetchLogs();
    }, [page, debouncedSearch, actionFilter, entityTypeFilter, roleFilter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await AuditLogService.getAuditLogs({ 
                page, 
                pageSize: 20,
                search: debouncedSearch || undefined,
                action: actionFilter || undefined,
                entityType: entityTypeFilter || undefined,
                role: roleFilter || undefined
            });
            setLogs(data.logs);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-2xl font-bold">Nhật ký hoạt động</h1>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="text"
                            placeholder="Tìm bằng tên NV, chi tiết, mã..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />

                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="">Tất cả thao tác</option>
                            <option value="Create">Thêm mới</option>
                            <option value="Update">Chỉnh sửa</option>
                            <option value="Delete">Xóa</option>
                            <option value="Cancel">Hủy đơn</option>
                            <option value="ToggleStatus">Đổi trạng thái</option>
                            <option value="AssignRole">Cấp Role</option>
                            <option value="RemoveRole">Xóa Role</option>
                        </select>

                        <select
                            value={entityTypeFilter}
                            onChange={(e) => setEntityTypeFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="">Tất cả loại dữ liệu</option>
                            <option value="User">Tài khoản</option>
                            <option value="GameAccount">Sản phẩm (Game)</option>
                            <option value="Promotion">Khuyến mãi</option>
                            <option value="Order">Đơn hàng</option>
                        </select>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        >
                            <option value="">Tất cả Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="MarketingStaff">Marketing Staff</option>
                            <option value="SalesStaff">Sales Staff</option>
                            <option value="Customer">Customer</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden p-4">
                    {loading ? (
                        <p className="text-center text-gray-500 py-4">Đang tải dữ liệu...</p>
                    ) : logs.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Chưa có nhật ký nào</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhân sự</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thực thể</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{format(new Date(log.createdAt), "HH:mm dd/MM/yyyy")}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{log.user?.userName || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{log.action}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{log.entityType} ({log.entityId.substring(0,8)}...)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.details}>{log.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                    {/* Simple Pagination */}
                    <div className="flex justify-between items-center mt-4 border-t pt-4">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                        >Trang trước</button>
                        <span>Trang {page} / {Math.ceil(totalCount / 20)}</span>
                        <button 
                            disabled={page * 20 >= totalCount} 
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                        >Trang sau</button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
