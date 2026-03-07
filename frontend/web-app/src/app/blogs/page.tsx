"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useBlogs } from "@/hooks/useBlogs";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BlogsPage() {
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const { data: blogsData, isLoading } = useBlogs(page, pageSize, true);
    const blogs = blogsData?.items || [];
    const totalPages = blogsData?.totalPages || 1;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white py-16 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-3">Tin tức & Blog</h1>
                    <p className="text-indigo-200 text-lg max-w-xl mx-auto">
                        Cập nhật những thông tin, thủ thuật và tin tức mới nhất về thế giới game
                    </p>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                                    <div className="h-48 bg-gray-200" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        <div className="h-6 bg-gray-200 rounded" />
                                        <div className="h-4 bg-gray-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-2xl shadow-sm">
                            <div className="text-6xl mb-4">📰</div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có bài viết nào</h2>
                            <p className="text-gray-500">Hãy quay lại sau để xem những tin tức mới nhất nhé!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogs.map((blog, index) => (
                                    <Link href={`/blogs/${blog.id}`} key={blog.id} className="group block">
                                        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
                                            {/* Thumbnail */}
                                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                                                {blog.thumbnailUrl ? (
                                                    <img 
                                                        src={blog.thumbnailUrl} 
                                                        alt={blog.title} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                        </svg>
                                                    </div>
                                                )}
                                                {blog.categoryName && (
                                                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        {blog.categoryName}
                                                    </div>
                                                )}
                                                {index === 0 && page === 1 && (
                                                    <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                        Nổi bật
                                                    </div>
                                                )}
                                            </div>
                                            {/* Content */}
                                            <div className="p-6 flex flex-col flex-grow">
                                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {blog.publishedAt
                                                        ? format(new Date(blog.publishedAt), "dd 'tháng' M, yyyy", { locale: vi })
                                                        : format(new Date(blog.createdAt), "dd 'tháng' M, yyyy", { locale: vi })}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug flex-grow">
                                                    {blog.title}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all mt-3 pt-3 border-t border-gray-50">
                                                    Đọc thêm
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center items-center gap-3">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        ← Trước
                                    </button>
                                    <span className="text-sm text-gray-600 font-medium">
                                        Trang {page} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        Sau →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
}
