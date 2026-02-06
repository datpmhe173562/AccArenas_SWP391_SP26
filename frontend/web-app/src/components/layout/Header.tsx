"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import { canAccessAdmin, canAccessMarketer, getManagementRoute, isAdmin } from "@/lib/roleUtils";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const logout = useLogout();

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
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Xin chào,{" "}
                  <span className="font-semibold">
                    {user?.userName || user?.email}
                  </span>
                </span>

                {(canAccessAdmin(user) || canAccessMarketer(user)) && (
                  <Link
                    href={getManagementRoute(user)}
                    className="text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    {isAdmin(user) ? "Quản trị viên" : "Marketing"}
                  </Link>
                )}
                <button
                  onClick={() => logout.logout()}
                  disabled={logout.loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
                >
                  {logout.loading ? "Đang đăng xuất..." : "Đăng xuất"}
                </button>
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
