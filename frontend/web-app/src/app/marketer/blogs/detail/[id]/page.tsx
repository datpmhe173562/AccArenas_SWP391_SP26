"use client";

import { useRouter, useParams } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { useBlog, useToggleBlogPublish, useDeleteBlog } from "@/hooks/useBlogs";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";

export default function BlogDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: blog, isLoading, refetch } = useBlog(id);
    const togglePublish = useToggleBlogPublish();
    const deleteBlog = useDeleteBlog();

    const handleTogglePublish = async () => {
        try {
            await togglePublish.mutateAsync(id);
            showSuccess(blog?.isPublished ? "Đã hủy xuất bản" : "Đã xuất bản bài viết");
            refetch();
        } catch (err: any) {
            showError(err.message);
        }
    };

    const handleDelete = async () => {
        const confirmed = await showConfirm(`Xóa bài viết "${blog?.title}"?`, "Xác nhận xóa");
        if (!confirmed) return;
        try {
            await deleteBlog.mutateAsync(id);
            showSuccess("Đã xóa bài viết");
            router.push("/marketer/blogs");
        } catch (err: any) {
            showError(err.message);
        }
    };

    if (isLoading) return <MarketerLayout><div className="flex justify-center items-center h-64 text-gray-500">Đang tải...</div></MarketerLayout>;
    if (!blog) return <MarketerLayout><div className="flex justify-center items-center h-64 text-gray-500">Không tìm thấy bài viết</div></MarketerLayout>;

    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Chi tiết bài viết</h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${blog.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                        {blog.isPublished ? "Đã xuất bản" : "Nháp"}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleTogglePublish} className={`px-4 py-2 text-sm rounded-md ${blog.isPublished ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-600 text-white hover:bg-green-700"}`}>
                                {blog.isPublished ? "Hủy xuất bản" : "Xuất bản"}
                            </button>
                            <button onClick={() => router.push(`/marketer/blogs/update/${id}`)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Cập nhật</button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Xóa</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Tiêu đề</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{blog.title}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Slug</p>
                            <p className="mt-1 text-sm text-gray-600 font-mono">{blog.slug}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Danh mục</p>
                            <p className="mt-1 text-sm text-gray-700">{blog.categoryName || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Ngày tạo</p>
                            <p className="mt-1 text-sm text-gray-700">{new Date(blog.createdAt).toLocaleString("vi-VN")}</p>
                        </div>
                        {blog.publishedAt && (
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">Ngày xuất bản</p>
                                <p className="mt-1 text-sm text-gray-700">{new Date(blog.publishedAt).toLocaleString("vi-VN")}</p>
                            </div>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Nội dung</p>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap text-sm leading-relaxed bg-gray-50 rounded-md p-4">
                            {blog.content}
                        </div>
                    </div>
                </div>
            </div>
        </MarketerLayout>
    );
}
