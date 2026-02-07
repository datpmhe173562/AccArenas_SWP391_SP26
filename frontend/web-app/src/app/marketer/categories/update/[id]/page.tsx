"use client";

import MarketerLayout from "@/components/layout/MarketerLayout";
import { CategoryForm } from "@/components/categories/category-form";
import { useParams } from "next/navigation";

export default function UpdateCategoryPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <MarketerLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <span>Danh mục</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Cập nhật</span>
                </div>
                {id && <CategoryForm id={id} />}
            </div>
        </MarketerLayout>
    );
}
