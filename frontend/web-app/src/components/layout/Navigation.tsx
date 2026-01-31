"use client";

import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useAuth";
import { showSuccess, showError } from "@/lib/sweetalert";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Đăng xuất thành công!");
    } catch (error) {
      console.error("Logout error:", error);
      showError("Không thể đăng xuất. Vui lòng thử lại!");
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-gray-900">
              AccArenas
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-700">
                  Xin chào, {user.fullName || user.userName}
                </span>
                {user.roles.includes("Admin") && (
                  <a
                    href="/admin"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Quản trị
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Đăng nhập
                </a>
                <a
                  href="/auth/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Đăng ký
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
