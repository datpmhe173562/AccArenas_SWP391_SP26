import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navigation from "@/components/layout/Navigation";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={["Admin"]}>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Quản trị hệ thống
              </h1>
              <p className="text-gray-600">Trang quản trị dành cho Admin.</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
