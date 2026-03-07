"use client";

import { useParams } from "next/navigation";
import { useBlog } from "@/hooks/useBlogs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BlogDetailPage() {
    const { id } = useParams();
    const { data: blog, isLoading, error } = useBlog(id as string);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {isLoading ? (
                    <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
                        <div className="h-6 bg-gray-200 rounded w-24" />
                        <div className="h-10 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-100 rounded w-48" />
                        <div className="bg-white rounded-2xl p-8 space-y-4">
                            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-100 rounded" />)}
                        </div>
                    </div>
                ) : error || !blog ? (
                    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
                        <p className="text-gray-500 mb-8">Bài viết này không tồn tại hoặc đã bị xóa.</p>
                        <Link href="/blogs" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                            ← Quay lại Blog
                        </Link>
                    </div>
                ) : (
                    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                        {/* Breadcrumb */}
                        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                            <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                            <span>/</span>
                            <Link href="/blogs" className="hover:text-indigo-600 transition-colors">Blog</Link>
                            <span>/</span>
                            <span className="text-gray-900 line-clamp-1">{blog.title}</span>
                        </nav>

                        {/* Category & Date */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            {blog.categoryName && (
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
                                    {blog.categoryName}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {blog.publishedAt
                                    ? format(new Date(blog.publishedAt), "dd 'tháng' M, yyyy", { locale: vi })
                                    : format(new Date(blog.createdAt), "dd 'tháng' M, yyyy", { locale: vi })}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
                            {blog.title}
                        </h1>

                        {/* Content */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                            <div
                                className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl"
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>

                        {/* Back button */}
                        <div className="mt-10">
                            <Link
                                href="/blogs"
                                className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Quay lại danh sách bài viết
                            </Link>
                        </div>
                    </main>
                )}
            </div>
            <Footer />
        </>
    );
}
