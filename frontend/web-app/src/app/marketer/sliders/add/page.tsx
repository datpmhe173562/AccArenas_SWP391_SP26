"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { useCreateSlider } from "@/hooks/useSliders";
import { showSuccess, showError } from "@/lib/sweetalert";

export default function AddSliderPage() {
    const router = useRouter();
    const createSlider = useCreateSlider();

    const [form, setForm] = useState({
        title: "",
        imageUrl: "",
        linkUrl: "",
        isActive: true,
        order: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createSlider.mutateAsync({
                title: form.title,
                imageUrl: form.imageUrl,
                linkUrl: form.linkUrl || undefined,
                isActive: form.isActive,
                order: form.order,
            });
            showSuccess("Tạo slider thành công");
            router.push("/marketer/sliders");
        } catch (err: any) {
            showError(err.response?.data?.message || err.message || "Có lỗi xảy ra");
        }
    };

    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Thêm slider mới</h1>
                            <p className="text-gray-600">Tạo slider hiển thị trên trang chủ</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Nhập tiêu đề slider"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                URL Hình ảnh <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={form.imageUrl}
                                onChange={(e) => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {form.imageUrl && (
                                <div className="mt-3 h-40 w-full max-w-sm rounded-lg overflow-hidden bg-gray-100">
                                    <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (tùy chọn)</label>
                            <input
                                type="text"
                                value={form.linkUrl}
                                onChange={(e) => setForm(prev => ({ ...prev, linkUrl: e.target.value }))}
                                placeholder="https://example.com/page"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                            <input
                                type="number"
                                value={form.order}
                                onChange={(e) => setForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                min={0}
                                className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={form.isActive}
                                onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Kích hoạt ngay</label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">Hủy</button>
                            <button type="submit" disabled={createSlider.isPending} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                                {createSlider.isPending ? "Đang tạo..." : "Tạo slider"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MarketerLayout>
    );
}
