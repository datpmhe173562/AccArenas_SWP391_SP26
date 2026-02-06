import MarketerLayout from "@/components/layout/MarketerLayout";
import { CategoriesList } from "@/components/categories/categories-list";
import { CreateCategoryForm } from "@/components/categories/create-category-form-new";

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <CreateCategoryForm />
                    </div>
                    <div>
                        <CategoriesList />
                    </div>
                </div>
            </div>
        </MarketerLayout>
    );
}