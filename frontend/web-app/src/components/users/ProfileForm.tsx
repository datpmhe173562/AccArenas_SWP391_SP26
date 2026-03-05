"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/sweetalert";

export default function ProfileForm() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        userName: "",
        createdAt: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated && !authLoading) return;
            try {
                const res = await authService.getProfile();
                if (res.user) {
                    setForm({
                        fullName: res.user.fullName || "",
                        phoneNumber: res.user.phoneNumber || "",
                        email: res.user.email,
                        userName: res.user.userName,
                        createdAt: new Date(res.user.createdAt).toLocaleDateString("vi-VN")
                    });
                }
            } catch (err: any) {
                // If we get an error, it might be because the token is expired or similar
                // Don't show error immediately on load if it's just a check
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        } else if (!authLoading) {
            setIsLoading(false);
        }
    }, [isAuthenticated, authLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await authService.updateProfile({
                fullName: form.fullName,
                phoneNumber: form.phoneNumber
            });
            showSuccess("Cập nhật thông tin thành công!");
            
            // Reload page or force auth context refresh
            window.location.reload();
        } catch (err: any) {
            showError(err.message || "Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-500 font-medium">Đang tải thông tin...</span>
            </div>
        );
    }

    return (
        <div className="bg-white shadow sm:rounded-2xl overflow-hidden border border-gray-100">
            <div className="px-6 py-8 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-6">
                        
                        {/* Username (Read Only) */}
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    disabled
                                    value={form.userName}
                                    className="block w-full sm:text-sm border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed px-4 py-3 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Địa chỉ Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    disabled
                                    value={form.email}
                                    className="block w-full sm:text-sm border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed px-4 py-3 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="sm:col-span-3">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="fullName"
                                    id="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    className="block w-full sm:text-sm border-gray-300 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="sm:col-span-3">
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    className="block w-full sm:text-sm border-gray-300 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="VD: 0912345678"
                                />
                            </div>
                        </div>

                        {/* Created At (Read Only) */}
                        <div className="sm:col-span-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Ngày tham gia hệ thống
                            </label>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-dashed border-gray-200">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {form.createdAt}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100 mt-8 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                        >
                            Trang chủ
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex justify-center bg-indigo-600 py-3 px-8 border border-transparent rounded-xl shadow-lg shadow-indigo-100 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all transform active:scale-95"
                        >
                            {isSaving ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang lưu...
                                </span>
                            ) : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
