import MarketerLayout from "@/components/layout/MarketerLayout";
import { SearchCategories } from "@/components/categories/search-categories";

export default function MarketerCategoriesPage() {
    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Quản lý Danh mục
                    </h1>
                    <p className="text-gray-600">
                        Tạo và quản lý danh mục sản phẩm
                    </p>
                </div>

                <SearchCategories />
            </div>
        </MarketerLayout>
    );
}