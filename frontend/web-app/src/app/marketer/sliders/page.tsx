import MarketerLayout from "@/components/layout/MarketerLayout";
import { SearchSliders } from "@/components/sliders/search-sliders";

export default function MarketerSlidersPage() {
    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Slider</h1>
                    <p className="text-gray-600">Tạo và quản lý slider hiển thị trên trang chủ</p>
                </div>
                <SearchSliders />
            </div>
        </MarketerLayout>
    );
}
