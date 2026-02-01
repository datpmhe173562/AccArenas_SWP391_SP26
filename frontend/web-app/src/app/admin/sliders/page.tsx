import AdminLayout from "@/components/layout/AdminLayout";

export default function SlidersPage() {
  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🎠</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý Slider
        </h1>
        <p className="text-gray-600 mb-4">
          Trang quản lý Sliders đang được phát triển
        </p>
        <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md">
          Coming Soon
        </div>
      </div>
    </AdminLayout>
  );
}
