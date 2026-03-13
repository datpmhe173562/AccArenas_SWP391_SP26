"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import { canAccessAdmin, canAccessMarketer, getManagementRoute, isAdmin } from "@/lib/roleUtils";

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
                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 italic">
                  <span>Xin chào, <span className="font-bold underline text-indigo-700">{user?.userName || user?.email}</span></span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 w-64 bg-white border border-gray-100 rounded-xl shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-[100]">
                  <div className="px-5 py-3 mb-2 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tài khoản của bạn</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                  </div>
                  
                  <div className="px-2 space-y-1">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all font-medium group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Trang cá nhân
                    </Link>

                    {/* Customer-only link */}
                    {!canAccessAdmin(user) && !canAccessMarketer(user) && (
                      <Link 
                        href="/orders" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all font-medium group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 118 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        Lịch sử mua hàng
                      </Link>
                    )}

                    {/* Staff Links */}
                    {(canAccessAdmin(user) || canAccessMarketer(user)) && (
                      <Link
                        href={getManagementRoute(user)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all font-medium group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        {isAdmin(user) ? "Quản trị viên" : "Marketing"}
                      </Link>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-50 px-2">
                    <button
                      onClick={async () => { await logout.logout(); router.push('/'); }}
                      disabled={logout.loading}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all font-semibold group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      {logout.loading ? "Đang đăng xuất..." : "Đăng xuất"}
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
