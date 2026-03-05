"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useGameAccount } from "@/hooks/useGameAccounts";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function GameAccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: account, isLoading, error } = useGameAccount(id);
    const [mainImage, setMainImage] = useState<string>("");

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
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="mb-8 text-sm text-gray-500">
                        <ol className="list-none p-0 inline-flex">
                            <li className="flex items-center">
                                <a href="/" className="hover:text-indigo-600">Trang chủ</a>
                                <span className="mx-2">/</span>
                            </li>
                            <li className="flex items-center">
                                <a href="/game-accounts" className="hover:text-indigo-600">Tài khoản</a>
                                <span className="mx-2">/</span>
                            </li>
                            <li className="flex items-center">
                                <span className="text-gray-900 font-medium">{account.accountName}</span>
                            </li>
                        </ol>
                    </nav>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            {/* Left: Images */}
                            <div className="p-8 bg-gray-50 border-r border-gray-100">
                                <div className="aspect-video relative rounded-xl overflow-hidden mb-4 bg-gray-200">
                                    <img
                                        src={currentImage}
                                        alt={account.accountName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg';
                                        }}
                                    />
                                </div>
                                
                                {images.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {images.map((img: string, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setMainImage(img)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImage === img ? 'border-indigo-600 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Info */}
                            <div className="p-8 md:p-12 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide mb-4 shadow-sm border border-indigo-100">
                                                {account.categoryName}
                                            </span>
                                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-900">{account.accountName}</h1>
                                            <p className="text-lg text-gray-500 font-medium flex items-center gap-2">
                                                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {account.game}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="my-8 p-6 bg-gradient-to-r from-indigo-50 to-pink-50 rounded-2xl border border-indigo-100/50">
                                        <div className="text-sm text-gray-600 font-medium mb-1">Giá bán niêm yết</div>
                                        <div className="text-4xl sm:text-5xl font-black text-pink-600 tracking-tight">
                                            {formatCurrency(account.price)}
                                        </div>
                                    </div>

                                    <div className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6 border border-gray-100 mb-8 space-y-4">
                                        <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Thông tin chi tiết
                                        </h3>
                                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mt-4">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider font-semibold">Mã Tài khoản</span>
                                                <div className="font-bold text-gray-900 text-base">#{account.id.split('-')[0].toUpperCase()}</div>
                                            </div>
                                            {account.rank && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider font-semibold">Rank / Cấp bậc</span>
                                                    <div className="font-bold text-indigo-700 text-base">{account.rank}</div>
                                                </div>
                                            )}
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider font-semibold">Trạng thái</span>
                                                <div className={`font-bold text-base flex items-center gap-1 ${account.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${account.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                                    {account.isAvailable ? 'Sẵn sàng giao dịch' : 'Đã bán'}
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <span className="text-gray-500 block mb-1 text-xs uppercase tracking-wider font-semibold">Ngày đăng bán</span>
                                                <div className="font-bold text-gray-900 text-base">
                                                    {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 md:mt-auto pt-6 border-t border-gray-100">
                                    <button
                                        disabled={!account.isAvailable}
                                        onClick={() => router.push(`/checkout?id=${account.id}`)}
                                        className="relative w-full overflow-hidden group py-4 px-8 rounded-xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600"
                                    >
                                        <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                                        <span className="relative flex items-center justify-center gap-2 text-lg font-black text-white tracking-widest uppercase">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            {account.isAvailable ? 'MUA NGAY' : 'HẾT HÀNG'}
                                        </span>
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        Giao dịch an toàn 100%. Tự động nhận thông tin.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
