import { axiosInstance } from '@/lib/axios';

export interface FavoriteDto {
    id: string;
    gameAccountId: string;
    game: string;
    accountName: string;
    price: number;
    isAvailable: boolean;
    categoryName?: string;
    firstImage?: string;
    addedAt: string;
}

export interface FavoriteResponse {
    totalCount: number;
    page: number;
    pageSize: number;
    items: FavoriteDto[];
}

export const FavoriteService = {
    async getMyFavorites(page = 1, pageSize = 20): Promise<FavoriteResponse> {
        const res = await axiosInstance.get<FavoriteResponse>('/api/Favorites', {
            params: { page, pageSize }
        });
        return res.data;
    },

    async toggleFavorite(gameAccountId: string): Promise<{ isFavorite: boolean }> {
        const res = await axiosInstance.post(`/api/Favorites/toggle/${gameAccountId}`);
        return res.data;
    },

    async checkIsFavorite(gameAccountId: string): Promise<{ isFavorite: boolean }> {
        const res = await axiosInstance.get(`/api/Favorites/check/${gameAccountId}`);
        return res.data;
    }
};
