"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchGameAccounts } from "@/hooks/useGameAccounts";
import { useAllCategories } from "@/hooks/useCategories";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeSlider from "@/components/sliders/HomeSlider";
import HomeBanner from "@/components/banners/HomeBanner";
import HomeBlog from "@/components/blogs/HomeBlog";
import FavoriteButton from "@/components/ui/FavoriteButton";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: categoriesResult, isLoading: loadingCategories } = useAllCategories();
  const categories = categoriesResult?.items || (Array.isArray(categoriesResult) ? categoriesResult : []);

  const { data: accountsResult, isLoading: loadingAccounts } = useSearchGameAccounts(
    "", "", undefined, undefined, true, 1, 8
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/game-accounts?query=${encodeURIComponent(search)}`);
    } else {
      router.push(`/game-accounts`);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <HomeSlider />
            <HomeBanner />
        </div>
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-sm font-semibold tracking-wider mb-6 text-indigo-200 backdrop-blur-sm">
                NỀN TẢNG MUA BÁN ACCOUNT SỐ 1
              </span>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                AccArenas
              </h1>
              <p className="mt-4 text-xl text-indigo-100/90 leading-relaxed mb-10">
                Thị trường giao dịch tài khoản game trực tuyến an toàn, bảo mật và siêu tốc. Tìm kiếm tài khoản VIP mơ ước của bạn ngay hôm nay!
              </p>

              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex items-center bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nhập tên game, tướng, rank..."
                  className="flex-1 bg-transparent border-none text-white placeholder-indigo-200 px-6 py-4 focus:outline-none focus:ring-0 text-lg"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh mục Game</h2>
                <p className="text-gray-500">Khám phá các tựa game đang hot nhất</p>
              </div>
            </div>

            {loadingCategories ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((cat: any) => (
                  <Link href={`/game-accounts?cat=${cat.id}`} key={cat.id} className="group block">
                    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-4 overflow-hidden group-hover:scale-110 transition-transform border border-gray-100">
                        <img 
                          src={cat.image || "https://scdn-stc.vnggames.com/mainsite/images/lol-banner-600x337.png"} 
                          alt={cat.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">{cat.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Products Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Tài khoản mới nhất</h2>
                <p className="text-gray-500">Những tài khoản VIP vừa được đưa lên sàn giao dịch</p>
              </div>
              <Link href="/game-accounts" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-1">
                Xem tất cả <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            {loadingAccounts ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : accountsResult?.items?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500">Chưa có tài khoản nào được đăng bán.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {accountsResult?.items?.map((account: any) => (
                  <Link href={`/game-accounts/${account.id}`} key={account.id} className="group block">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative">
                       {/* Favorite Button */}
                       <div className="absolute top-2 left-2 z-10">
                           <FavoriteButton gameAccountId={account.id} className="bg-white/90 shadow-sm backdrop-blur-md hover:scale-105" />
                       </div>
                       
                       <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                          <img
                              src={account.images?.[0] || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg'}
                              alt={account.accountName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg';
                              }}
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                              {account.categoryName}
                          </div>
                      </div>
                      <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                              {account.accountName}
                          </h3>
                          <div className="flex items-center gap-2 mb-4">
                              <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">Rank: {account.rank || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                              <div>
                                  <div className="text-xs text-gray-400 mb-1">Giá bán</div>
                                  <div className="text-xl font-black text-pink-600">
                                      {formatCurrency(account.price)}
                                  </div>
                              </div>
                              <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                  </svg>
                              </div>
                          </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>



        <HomeBlog />

      </div>
      <Footer />
    </>
  );
}
