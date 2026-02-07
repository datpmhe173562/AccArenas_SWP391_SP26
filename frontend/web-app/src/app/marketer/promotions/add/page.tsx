import MarketerLayout from "@/components/layout/MarketerLayout";
import { PromotionForm } from "@/components/promotions/promotion-form";

export default function AddPromotionPage() {
    return (
        <MarketerLayout>
             <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Tạo Voucher Mới
                </h1>
                <p className="mt-2 text-gray-600">
                    Thêm mã giảm giá mới và thiết lập thời gian áp dụng
                </p>
            </div>
            
            <PromotionForm />
        </MarketerLayout>
    );
}
