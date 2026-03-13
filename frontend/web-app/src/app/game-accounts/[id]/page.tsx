"use client";

import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useGameAccount, useSearchGameAccounts } from "@/hooks/useGameAccounts";
import Link from "next/link";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function GameAccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: account, isLoading, error } = useGameAccount(id);
    const [mainImage, setMainImage] = useState<string>("");

    // Fetch related products from same category (load after account data resolves)
    const { data: relatedData } = useSearchGameAccounts(
        "", account?.categoryId ?? "", undefined, undefined, true, 1, 7, !!account?.categoryId
    );
    const related = (relatedData?.items || []).filter((a: any) => a.id !== id).slice(0, 6);

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex justify-center items-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
                <Footer />
            </>
        );
    }

    if (error || !account) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy tài khoản</h2>
                    <button
                        onClick={() => router.push('/game-accounts')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Quay lại danh sách
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    const images = account.images?.length > 0 ? account.images : ['https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg'];
    const currentImage = mainImage || images[0];

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <Link href="/" className="hover:text-indigo-600 transition">Trang chủ</Link>
                    <span>/</span>
                    <Link href="/game-accounts" className="hover:text-indigo-600 transition">Tài khoản</Link>
                    <span>/</span>
                    <span className="text-gray-900 truncate max-w-[200px]">{account.accountName}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Left: Images */}
                        <div className="lg:col-span-12 xl:col-span-5 p-6 bg-gray-50/50">
                            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-md border-2 border-white mb-4">
                                <img
                                    src={currentImage}
                                    alt={account.accountName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg';
                                    }}
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black text-white shadow-lg uppercase tracking-wider">
                                        Ảnh thực tế
                                    </span>
                                </div>
                            </div>
                            
                            {images.length > 1 && (
                                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                                    {images.map((img: string, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setMainImage(img)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentImage === img ? 'border-indigo-600 scale-95' : 'border-white hover:border-indigo-200'}`}
                                        >
                                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="lg:col-span-12 xl:col-span-7 p-8 md:p-10 flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                                            {account.categoryName}
                                        </span>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tight border ${account.isAvailable ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                                            {account.isAvailable ? '• ĐANG BÁN' : '• ĐÃ BÁN'}
                                        </div>
                                    </div>
                                    <h1 className="text-3xl font-black text-gray-900 leading-tight mb-1">{account.accountName}</h1>
                                    <p className="text-sm text-gray-400 font-medium">Sản phẩm của {account.game} • Đăng: {new Date(account.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Mã sản phẩm</span>
                                    <span className="font-mono font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded text-xs uppercase">#{account.id.split('-')[0]}</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-3xl p-6 mb-8 border border-indigo-50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block opacity-70">Giá giao dịch</span>
                                <div className="text-4xl font-black text-pink-600 tracking-tighter">
                                    {formatCurrency(account.price)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Cấp bậc / Rank</span>
                                        <span className="font-bold text-gray-800 text-sm">{account.rank || "N/A"}</span>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Bảo mật</span>
                                        <span className="font-bold text-green-600 text-sm">Chính chủ 100%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto">
                                {account.isAvailable ? (
                                    <button
                                        onClick={() => router.push(`/checkout?id=${account.id}`)}
                                        className="flex-1 py-4 px-8 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        Mua tài khoản ngay
                                    </button>
                                ) : (
                                    <div className="flex-1 py-4 px-8 bg-gray-100 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-dashed border-gray-200">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                        Sản phẩm đã bán
                                    </div>
                                )}
                                <button className="px-6 py-4 border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-100 hover:text-indigo-600 transition-all">
                                    Ưa thích
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tight">Tài khoản tương tự</h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">Cùng danh mục {account.categoryName}</p>
                            </div>
                            <Link href={`/game-accounts?cat=${account.categoryId}`} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {related.map((rel: any) => (
                                <Link href={`/game-accounts/${rel.id}`} key={rel.id} className="group">
                                    <div className="bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                            <img
                                                src={rel.images?.[0] || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg'}
                                                alt={rel.accountName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {!rel.isAvailable && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                                                    <span className="text-[8px] font-black text-white bg-red-500 px-2 py-1 rounded-full uppercase tracking-tighter">Đã bán</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-[11px] font-black text-gray-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{rel.accountName}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 mt-0.5">{rel.rank || "No Rank"}</p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs font-black text-indigo-600">{formatCurrency(rel.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}
