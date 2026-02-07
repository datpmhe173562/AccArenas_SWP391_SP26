"use client";

import MarketerLayout from "@/components/layout/MarketerLayout";
import { PromotionForm } from "@/components/promotions/promotion-form";
import { useParams } from "next/navigation";

export default function UpdatePromotionPage() {
    const params = useParams();
    const id = params?.id as string;

    return (
        <MarketerLayout>
             <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Cập nhật Voucher
                </h1>
                <p className="mt-2 text-gray-600">chỉnh sửa thông tin khuyến mãi và thời gian áp dụng</p>
            </div>
            
            <PromotionForm id={id} />
        </MarketerLayout>
    );
}
