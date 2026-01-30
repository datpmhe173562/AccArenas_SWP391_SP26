"use client";

import { useAuth } from "@/context/AuthContext";

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
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
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Đăng xuất
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
