"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import { canAccessAdmin, canAccessMarketer, getManagementRoute, isAdmin, isSalesStaff, isCustomer } from "@/lib/roleUtils";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🎮</div>
              <span className="text-xl font-bold text-indigo-600">
                AccArenas
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/game-accounts"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Tài khoản game
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Danh mục
            </Link>
            <Link
              href="/blogs"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/promotions"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Khuyến mãi
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-3 p-1 pr-3 rounded-full bg-gray-50 border border-gray-100 hover:border-indigo-200 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md group-hover:ring-2 group-hover:ring-indigo-500/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-inner">
                    {(user?.userName || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-gray-500 leading-none mb-0.5">Xin chào</span>
                    <span className="text-sm font-bold text-gray-800 leading-none truncate max-w-[100px]">
                      {user?.userName || user?.email?.split('@')[0]}
                    </span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute top-full right-0 mt-2 w-72 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-[100] overflow-hidden">
                  {/* Dropdown Header */}
                  <div className="px-6 py-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-1 opacity-80">Tài khoản</p>
                      <p className="text-base font-bold truncate">{user?.userName || "User"}</p>
                      <p className="text-xs text-indigo-100 truncate opacity-90">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-1 bg-white/50">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white rounded-xl transition-all duration-200 font-bold group/item shadow-sm hover:shadow-indigo-200/50"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Trang cá nhân
                    </Link>

                    {isCustomer(user) && (
                      <Link 
                        href="/profile/favorites" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white rounded-xl transition-all duration-200 font-bold group/item shadow-sm hover:shadow-indigo-200/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        Sản phẩm yêu thích
                      </Link>
                    )}

                    {/* Customer-only link */}
                    {isCustomer(user) && (
                      <Link 
                        href="/orders" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white rounded-xl transition-all duration-200 font-bold group/item shadow-sm hover:shadow-indigo-200/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        Lịch sử mua hàng
                      </Link>
                    )}

                    {isCustomer(user) && (
                      <Link 
                        href="/inquiries" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white rounded-xl transition-all duration-200 font-bold group/item shadow-sm hover:shadow-indigo-200/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        Khiếu nại của tôi
                      </Link>
                    )}

                    {/* Staff Links */}
                    {(canAccessAdmin(user) || canAccessMarketer(user) || isSalesStaff(user)) && (
                      <Link
                        href={getManagementRoute(user)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 font-bold group/item shadow-lg shadow-indigo-200"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        {isAdmin(user) ? "Quản trị viên" : isSalesStaff(user) ? "Sales Portal" : "Marketing Portal"}
                      </Link>
                    )}
                  </div>

                  <div className="pb-3 px-3 w-full">
                    <button
                      onClick={async () => { await logout.logout(); router.push('/'); }}
                      disabled={logout.loading}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200 font-bold group/item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      {logout.loading ? "Đang xử lý..." : "Đăng xuất hệ thống"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
