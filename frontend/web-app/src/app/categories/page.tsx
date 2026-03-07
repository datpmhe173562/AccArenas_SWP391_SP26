"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAllCategories } from "@/hooks/useCategories";
import Link from "next/link";

export default function CategoriesPage() {
    const { data: categoriesResult, isLoading } = useAllCategories();
    const categories = (categoriesResult as any)?.items || (Array.isArray(categoriesResult) ? categoriesResult : []);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50">
                {/* Hero */}
                <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white py-16 px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-3">Danh mục Game</h1>
                    <p className="text-indigo-200 text-lg max-w-xl mx-auto">
                        Khám phá tất cả các danh mục tựa game đang có trên AccArenas
                    </p>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                                <div key={i} className="bg-white rounded-2xl p-6 text-center animate-pulse">
                                    <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-4" />
                                    <div className="h-4 bg-gray-200 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-2xl shadow-sm">
                            <div className="text-6xl mb-4">🎮</div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có danh mục nào</h2>
                            <p className="text-gray-500">Hãy quay lại sau nhé!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {categories.map((cat: any) => (
                                <Link href={`/game-accounts?cat=${cat.id}`} key={cat.id} className="group block">
                                    <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-md flex items-center justify-center mb-4 overflow-hidden group-hover:scale-110 transition-transform border border-gray-100">
                                            <img
                                                src={cat.image || "https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png"}
                                                alt={cat.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png";
                                                }}
                                            />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{cat.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1 group-hover:text-indigo-500">Xem tài khoản →</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </>
    );
}
