import MarketerLayout from "@/components/layout/MarketerLayout";
import { GameAccountsList } from "@/components/game-accounts/game-accounts-list";
import { SearchGameAccounts } from "@/components/game-accounts/search-game-accounts";

export default function MarketerProductsPage() {
    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Quản lý Sản phẩm
                    </h1>
                    <p className="text-gray-600">
                        Quản lý tài khoản game và sản phẩm
                    </p>
                </div>

                <SearchGameAccounts />
                <GameAccountsList />
            </div>
        </MarketerLayout>
    );
}