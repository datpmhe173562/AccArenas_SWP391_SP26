import MarketerLayout from "@/components/layout/MarketerLayout";
import { SearchBanners } from "@/components/banners/search-banners";

export default function MarketerBannersPage() {
    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Banner</h1>
                    <p className="text-gray-600">Tạo và quản lý banner hiển thị trên trang chủ</p>
                </div>
                <SearchBanners />
            </div>
        </MarketerLayout>
    );
}
