"use client";

import { useState, useEffect } from "react";
import { FavoriteService, FavoriteDto } from "@/services/favoriteService";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/ui/FavoriteButton";

export default function FavoritesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<FavoriteDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const data = await FavoriteService.getMyFavorites(page, 12);
            setFavorites(data.items);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error("Failed to fetch favorites", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                fetchFavorites();
            } else {
                setLoading(false);
            }
        }
    }, [user, authLoading, page]);

    if (authLoading) return <div className="flex justify-center p-12">Đang tải...</div>;

    if (!user) {
        return (
            <>
                <Header />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Sản phẩm yêu thích</h1>
                    <p className="text-gray-500 mb-6">Bạn cần đăng nhập để xem danh sách yêu thích.</p>
                    <Link href="/auth/login" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                        Đăng nhập ngay
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <svg className="w-8 h-8 text-red-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        Danh sách yêu thích
                    </h1>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-xl h-80 shadow-sm border border-gray-100"></div>
                            ))}
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                            <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Chưa có sản phẩm nào</h2>
                            <p className="text-gray-500 mb-6">Bạn chưa thêm tài khoản nào vào danh sách yêu thích.</p>
                            <Link href="/games" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm">
                                Khám phá ngay
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                {favorites.map(fav => (
                                    <div key={fav.id} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 relative">
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                            {fav.isAvailable ? (
                                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90">
                                                    Còn hàng
                                                </span>
                                            ) : (
                                                <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    Đã bán
                                                </span>
                                            )}
                                        </div>

                                        {/* Favorite Toggle Button */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <FavoriteButton gameAccountId={fav.gameAccountId} className="bg-white shadow-md hover:scale-105" />
                                        </div>

                                        <Link href={`/games/${fav.gameAccountId}`} className="flex-grow flex flex-col block">
                                            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                                {fav.firstImage ? (
                                                    <Image 
                                                        src={fav.firstImage} 
                                                        alt={fav.accountName} 
                                                        fill 
                                                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!fav.isAvailable ? 'grayscale opacity-70' : ''}`}
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                        <span>No Image</span>
                                                    </div>
                                                )}
                                                
                                                {/* Sold out overlay */}
                                                {!fav.isAvailable && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rotate-[-15deg] uppercase">Sold Out</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className={`p-4 flex flex-col flex-grow ${!fav.isAvailable ? 'bg-gray-50' : ''}`}>
                                                <div className="text-xs font-medium text-primary mb-1">{fav.game}</div>
                                                <h3 className={`font-semibold text-lg mb-2 line-clamp-1 ${!fav.isAvailable ? 'text-gray-500' : 'text-gray-900'}`} title={fav.accountName}>
                                                    {fav.accountName}
                                                </h3>
                                                
                                                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                                                    <div className={`font-bold text-lg ${!fav.isAvailable ? 'text-gray-400' : 'text-red-500'}`}>
                                                        {fav.price.toLocaleString('vi-VN')} đ
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalCount > 12 && (
                                <div className="flex justify-center mt-10">
                                    <div className="flex gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                                        <button 
                                            disabled={page === 1} 
                                            onClick={() => setPage(page - 1)}
                                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-600"
                                        >
                                            Trang trước
                                        </button>
                                        <div className="flex items-center px-4 text-sm font-medium text-gray-500 border-x border-gray-100">
                                            {page} / {Math.ceil(totalCount / 12)}
                                        </div>
                                        <button 
                                            disabled={page * 12 >= totalCount} 
                                            onClick={() => setPage(page + 1)}
                                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary disabled:opacity-30 disabled:hover:text-gray-600"
                                        >
                                            Trang tiếp
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
