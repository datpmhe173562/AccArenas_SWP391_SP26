import MarketerLayout from "@/components/layout/MarketerLayout";

export default function MarketerDashboard() {
    return (
        <MarketerLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Chào mừng đến với Trang Marketer
                    </h1>
                    <p className="text-gray-600">
                        Quản lý sản phẩm, danh mục và voucher từ đây
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng sản phẩm</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-gray-500">Tài khoản game được quản lý</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng danh mục</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-gray-500">Phân loại sản phẩm</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tổng voucher</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">--</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs text-gray-500">Khuyến mãi đang hoạt động</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Thêm sản phẩm mới</p>
                                    <p className="text-sm text-gray-500">Tạo tài khoản game mới</p>
                                </div>
                            </div>
                        </button>

                        <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Thêm danh mục</p>
                                    <p className="text-sm text-gray-500">Tạo phân loại mới</p>
                                </div>
                            </div>
                        </button>

                        <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Tạo voucher</p>
                                    <p className="text-sm text-gray-500">Khuyến mãi mới</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </MarketerLayout>
    );
}