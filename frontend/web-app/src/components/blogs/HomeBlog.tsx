"use client";

import { useBlogs } from "@/hooks/useBlogs";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function HomeBlog() {
    const { data: blogsData, isLoading } = useBlogs(1, 3, true);
    const blogs = blogsData?.items || [];

    if (isLoading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                    <div className="h-6 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-100 rounded" />
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (blogs.length === 0) return null;

    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tin tức & Blog</h2>
                        <p className="text-gray-500">Cập nhật những tin tức, thủ thuật và thông tin mới nhất về game</p>
                    </div>
                    <Link
                        href="/blogs"
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-1"
                    >
                        Xem tất cả <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                        </div>
                                    )}
                                    {/* Category Badge */}
                                    {blog.categoryName && (
                                        <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {blog.categoryName}
                                        </div>
                                    )}
                                    {/* Featured label for first post */}
                                    {index === 0 && (
                                        <div className="absolute top-4 right-4 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Nổi bật
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    {/* Date */}
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {blog.publishedAt
                                            ? format(new Date(blog.publishedAt), "dd 'tháng' M, yyyy", { locale: vi })
                                            : format(new Date(blog.createdAt), "dd 'tháng' M, yyyy", { locale: vi })}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug flex-grow">
                                        {blog.title}
                                    </h3>

                                    {/* Read more */}
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
            </div>
        </section>
    );
}
