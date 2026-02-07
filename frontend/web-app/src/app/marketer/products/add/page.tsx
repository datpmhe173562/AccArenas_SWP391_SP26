"use client";

import MarketerLayout from "@/components/layout/MarketerLayout";
import { GameAccountForm } from "@/components/game-accounts/game-account-form";

export default function AddProductPage() {
    return (
        <MarketerLayout>
            <div className="max-w-4xl mx-auto py-8 px-4">
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <span>Sản phẩm</span>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Thêm mới</span>
                </div>
                <GameAccountForm />
            </div>
        </MarketerLayout>
    );
}
