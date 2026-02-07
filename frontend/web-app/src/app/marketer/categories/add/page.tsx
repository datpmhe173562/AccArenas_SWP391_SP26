"use client";

import MarketerLayout from "@/components/layout/MarketerLayout";
import { CategoryForm } from "@/components/categories/category-form";

export default function AddCategoryPage() {
    return (
        <MarketerLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <span>Danh mục</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Thêm mới</span>
                </div>
                <CategoryForm />
            </div>
        </MarketerLayout>
    );
}
