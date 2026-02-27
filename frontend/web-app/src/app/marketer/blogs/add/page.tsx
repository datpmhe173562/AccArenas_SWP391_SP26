"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { useCreateBlog } from "@/hooks/useBlogs";
import { useAllCategories } from "@/hooks/useCategories";
import { showSuccess, showError } from "@/lib/sweetalert";
import RichTextEditor from "@/components/common/RichTextEditor";

export default function AddBlogPage() {
    const router = useRouter();
    const createBlog = useCreateBlog();
    const { data: categoriesData } = useAllCategories();
    const categories = (categoriesData as any)?.items || [];

    const [form, setForm] = useState({
        title: "",
        slug: "",
        content: "",
        categoryId: "",
        isPublished: false,
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (form.title) {
            setForm(prev => ({
                ...prev,
                slug: form.title
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-"),
            }));
        }
    }, [form.title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.categoryId) {
            showError("Vui lòng chọn danh mục");
            return;
        }
        try {
            await createBlog.mutateAsync({
                title: form.title,
                slug: form.slug || undefined,
                content: form.content,
                categoryId: form.categoryId,
                isPublished: form.isPublished,
            });
            showSuccess("Tạo bài viết thành công");
            router.push("/marketer/blogs");
        } catch (err: any) {
            showError(err.response?.data?.message || err.message || "Có lỗi xảy ra");
        }
    };

    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Thêm bài viết mới</h1>
                            <p className="text-gray-600">Tạo bài viết blog mới</p>
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
                                placeholder="Nhập tiêu đề bài viết"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="tu-dong-tao-tu-tieu-de"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <p className="mt-1 text-xs text-gray-400">Để trống để tự động tạo từ tiêu đề</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.categoryId}
                                onChange={(e) => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
                                required
                                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                value={form.content}
                                onChange={(val) => setForm(prev => ({ ...prev, content: val }))}
                                placeholder="Nhập nội dung bài viết..."
                                minHeight="350px"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isPublished"
                                checked={form.isPublished}
                                onChange={(e) => setForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                                Xuất bản ngay
                            </label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={createBlog.isPending}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {createBlog.isPending ? "Đang tạo..." : "Tạo bài viết"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MarketerLayout>
    );
}
