"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSearchGameAccounts } from "@/hooks/useGameAccounts";
import { useAllCategories } from "@/hooks/useCategories";
import { useSearchParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

function GameAccountsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "");
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();

    // When URL params change (e.g. user navigates from home), sync state
    useEffect(() => {
        const q = searchParams.get("query") || "";
        const cat = searchParams.get("cat") || "";
        setSearchQuery(q);
        setSelectedCategory(cat);
        setPage(1);
    }, [searchParams]);

    const pageSize = 12;

    const { data: categoriesResult, isLoading: loadingCategories } = useAllCategories();
    const categories = (categoriesResult as any)?.items || (Array.isArray(categoriesResult) ? categoriesResult : []);

    const { data: accountsResult, isLoading: loadingAccounts } = useSearchGameAccounts(
        searchQuery,
        selectedCategory,
        minPrice,
        maxPrice,
        true, // isAvailable
        page,
        pageSize
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        // Update URL to reflect current search
        const params = new URLSearchParams();
        if (searchQuery) params.set("query", searchQuery);
        if (selectedCategory) params.set("cat", selectedCategory);
        router.push(`/game-accounts?${params.toString()}`);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setPage(1);
        router.push("/game-accounts");
    };


    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-full md:w-64 shrink-0 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Bộ lọc tìm kiếm</h2>
                                <form onSubmit={handleSearch} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tìm kiếm
                                        </label>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Tên game, tài khoản..."
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Danh mục
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                        >
                                            <option value="">Tất cả danh mục</option>
                                            {!loadingCategories && Array.isArray(categories) && categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá tối thiểu (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            value={minPrice || ""}
                                            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder="0"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Giá tối đa (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            value={maxPrice || ""}
                                            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder="1,000,000"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                        />
                                    </div>

                                    <div className="pt-4 flex flex-col gap-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                                        >
                                            Áp dụng
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                        >
                                            Xoá bộ lọc
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Main Content */}
                         <div className="flex-1 min-w-0">
                             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                                 <h1 className="text-3xl font-bold text-gray-900">Tài khoản Game</h1>
                                 {accountsResult && (
                                     <span className="text-sm text-gray-500">{accountsResult.totalCount} tài khoản</span>
                                 )}
                             </div>

                             {/* Category chips */}
                             {!loadingCategories && categories.length > 0 && (
                                 <div className="flex flex-wrap gap-2 mb-6">
                                     <button
                                         onClick={() => { setSelectedCategory(""); setPage(1); }}
                                         className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"}`}
                                     >
                                         Tất cả
                                     </button>
                                     {categories.map((cat: any) => (
                                         <button
                                             key={cat.id}
                                             onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                                             className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"}`}
                                         >
                                             {cat.name}
                                         </button>
                                     ))}
                                 </div>
                             )}

                             {loadingAccounts ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : accountsResult?.items?.length === 0 ? (
                                <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
                                    <div className="text-gray-400 mb-4 text-5xl">🎮</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tài khoản</h3>
                                    <p className="text-gray-500">Thử thay đổi bộ lọc tìm kiếm của bạn.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {accountsResult?.items?.map((account: any) => (
                                            <Link href={`/game-accounts/${account.id}`} key={account.id} className="group">
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                                                    <div className="w-full h-48 bg-gray-200 relative">
                                                        {account.images && account.images.length > 0 ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={account.images[0]}
                                                                alt={account.accountName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg"
                                                                alt={account.accountName}
                                                                className="w-full h-full object-cover opacity-80"
                                                            />
                                                        )}
                                                        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                            {account.categoryName}
                                                        </div>
                                                    </div>
                                                    <div className="p-5">
                                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                            {account.accountName}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mb-4">{account.game}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xl font-bold text-pink-600">
                                                                {formatCurrency(account.price)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {((accountsResult?.totalPages) || 0) > 1 && (
                                        <div className="mt-10 flex justify-center space-x-2">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Trước
                                            </button>
                                            <span className="px-4 py-2 text-sm text-gray-700 flex items-center">
                                                Trang {page} / {accountsResult?.totalPages || 1}
                                            </span>
                                            <button
                                                onClick={() => setPage(p => Math.min(accountsResult?.totalPages || 1, p + 1))}
                                                disabled={page === (accountsResult?.totalPages || 1)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default function GameAccountsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <GameAccountsContent />
        </Suspense>
    );
}
