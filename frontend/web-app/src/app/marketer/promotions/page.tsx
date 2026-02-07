import MarketerLayout from "@/components/layout/MarketerLayout";
import { SearchPromotions } from "@/components/promotions/search-promotions";
import { Suspense } from "react";

function PromotionsContent() {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Quản lý Voucher
                </h1>
                <p className="text-gray-600">
                    Tạo và quản lý các chương trình khuyến mãi, mã giảm giá cho hệ thống.
                </p>
            </div>

            <SearchPromotions />
        </div>
    );
}

export default function MarketerPromotionsPage() {
    return (
        <MarketerLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <PromotionsContent />
            </Suspense>
        </MarketerLayout>
    );
}