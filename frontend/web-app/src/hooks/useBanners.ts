import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bannerService } from '@/services/bannerService';
import { CreateBannerRequest, UpdateBannerRequest } from '@/types/generated-api';

const QUERY_KEYS = {
    banners: 'banners',
    banner: 'banner',
} as const;

export const useBanners = (page = 1, pageSize = 10, isActive?: boolean) => {
    return useQuery({
        queryKey: [QUERY_KEYS.banners, { page, pageSize, isActive }],
        queryFn: () => bannerService.getBanners(page, pageSize, isActive),
    });
};

export const useBanner = (id: string, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.banner, id],
        queryFn: () => bannerService.getBannerById(id),
        enabled: enabled && !!id,
    });
};

export const useCreateBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateBannerRequest) => bannerService.createBanner(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
        },
    });
};

export const useUpdateBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBannerRequest }) =>
            bannerService.updateBanner(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banner, id] });
        },
    });
};

export const useDeleteBanner = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bannerService.deleteBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
        },
    });
};

export const useToggleBannerStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bannerService.toggleBannerStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banner, id] });
        },
    });
};
