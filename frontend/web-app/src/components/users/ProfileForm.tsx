"use client";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/sweetalert";

export default function ProfileForm() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPw, setIsChangingPw] = useState(false);
    const [showPwSection, setShowPwSection] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        userName: "",
        createdAt: ""
    });

    const [pwForm, setPwForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        const fetchProfile = async () => {
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
                // silently handle
            } finally {
                setIsLoading(false);
            }
        };
        if (isAuthenticated) fetchProfile();
        else if (!authLoading) setIsLoading(false);
    }, [isAuthenticated, authLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await authService.updateProfile({ fullName: form.fullName, phoneNumber: form.phoneNumber });
            showSuccess("Cập nhật thông tin thành công!");
            window.location.reload();
        } catch (err: any) {
            showError(err.message || "Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            showError("Xác nhận mật khẩu không khớp");
            return;
        }
        if (pwForm.newPassword.length < 6) {
            showError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
        setIsChangingPw(true);
        try {
            await authService.changePassword(pwForm.currentPassword, pwForm.newPassword, pwForm.confirmPassword);
            showSuccess("Đổi mật khẩu thành công!");
            setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowPwSection(false);
        } catch (err: any) {
            showError(err.message || "Đổi mật khẩu thất bại");
        } finally {
            setIsChangingPw(false);
        }
    };

    const EyeIcon = ({ visible }: { visible: boolean }) => visible ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    );

    const PwField = ({ field, label, placeholder }: { field: "current" | "new" | "confirm"; label: string; placeholder: string }) => {
        const key = field === "current" ? "currentPassword" : field === "new" ? "newPassword" : "confirmPassword";
        return (
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                <div className="relative">
                    <input
                        type={showPw[field] ? "text" : "password"}
                        value={pwForm[key]}
                        onChange={(e) => setPwForm(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={placeholder}
                        required
                        className="block w-full sm:text-sm border-gray-300 rounded-xl px-4 py-3 border pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw(prev => ({ ...prev, [field]: !prev[field] }))}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <EyeIcon visible={showPw[field]} />
                    </button>
                </div>
            </div>
        );
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
        <div className="space-y-6">
            {/* Profile Info Form */}
            <div className="bg-white shadow sm:rounded-2xl overflow-hidden border border-gray-100">
                <div className="px-6 py-8 sm:p-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        Thông tin cá nhân
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Username (Read Only) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
                                <input type="text" disabled value={form.userName}
                                    className="block w-full sm:text-sm border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed px-4 py-3 shadow-sm" />
                            </div>
                            {/* Email (Read Only) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ Email</label>
                                <input type="email" disabled value={form.email}
                                    className="block w-full sm:text-sm border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed px-4 py-3 shadow-sm" />
                            </div>
                            {/* Full Name */}
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                                <input type="text" name="fullName" id="fullName" value={form.fullName} onChange={handleChange}
                                    className="block w-full sm:text-sm border-gray-300 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="VD: Nguyễn Văn A" />
                            </div>
                            {/* Phone */}
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                                <input type="text" name="phoneNumber" id="phoneNumber" value={form.phoneNumber} onChange={handleChange}
                                    className="block w-full sm:text-sm border-gray-300 rounded-xl px-4 py-3 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                    placeholder="VD: 0912345678" />
                            </div>
                            {/* Created At */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày tham gia hệ thống</label>
                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-xl border border-dashed border-gray-200">
                                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {form.createdAt}
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                            <button type="button" onClick={() => router.push("/")}
                                className="bg-white py-3 px-6 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                                Trang chủ
                            </button>
                            <button type="submit" disabled={isSaving}
                                className="inline-flex justify-center bg-indigo-600 py-3 px-8 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all transform active:scale-95 shadow-lg shadow-indigo-100">
                                {isSaving ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Đang lưu...
                                    </span>
                                ) : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white shadow sm:rounded-2xl overflow-hidden border border-gray-100">
                <button
                    type="button"
                    onClick={() => setShowPwSection(!showPwSection)}
                    className="w-full flex items-center justify-between px-6 py-5 sm:px-10 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-gray-900">Đổi mật khẩu</p>
                            <p className="text-xs text-gray-500">Cập nhật mật khẩu để bảo mật tài khoản</p>
                        </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${showPwSection ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {showPwSection && (
                    <div className="px-6 pb-8 sm:px-10 border-t border-gray-100">
                        <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
                            <PwField field="current" label="Mật khẩu hiện tại" placeholder="Nhập mật khẩu hiện tại" />
                            <PwField field="new" label="Mật khẩu mới" placeholder="Tối thiểu 6 ký tự" />
                            <PwField field="confirm" label="Xác nhận mật khẩu mới" placeholder="Nhập lại mật khẩu mới" />
                            <div className="flex justify-end gap-4 pt-2">
                                <button type="button"
                                    onClick={() => { setShowPwSection(false); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}
                                    className="py-3 px-6 border border-gray-300 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                                    Hủy
                                </button>
                                <button type="submit" disabled={isChangingPw}
                                    className="inline-flex justify-center bg-orange-500 py-3 px-8 rounded-xl text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50 transition-all transform active:scale-95 shadow-lg shadow-orange-100">
                                    {isChangingPw ? "Đang xử lý..." : "Đổi mật khẩu"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
