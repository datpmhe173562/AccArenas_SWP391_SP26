import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { promotionService } from '@/services/promotionService';
import { CreatePromotionRequest, UpdatePromotionRequest, PromotionQueryRequest } from '@/types/generated-api';

// Query keys
export const PROMOTION_KEYS = {
    promotions: 'promotions',
    promotion: 'promotion',
} as const;

// Get promotions with filter and pagination
export const usePromotions = (query: PromotionQueryRequest) => {
    return useQuery({
        queryKey: [PROMOTION_KEYS.promotions, query],
        queryFn: () => promotionService.getPromotions(query),
    });
};

// Get promotion by ID
export const usePromotion = (id: string, enabled = true) => {
    return useQuery({
        queryKey: [PROMOTION_KEYS.promotion, id],
        queryFn: () => promotionService.getPromotionById(id),
        enabled: enabled && !!id,
    });
};

// Create promotion mutation
export const useCreatePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePromotionRequest) => promotionService.createPromotion(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROMOTION_KEYS.promotions] });
        },
    });
};

// Update promotion mutation
export const useUpdatePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdatePromotionRequest }) =>
            promotionService.updatePromotion(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [PROMOTION_KEYS.promotions] });
            queryClient.invalidateQueries({ queryKey: [PROMOTION_KEYS.promotion, id] });
        },
    });
};

// Delete promotion mutation
export const useDeletePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => promotionService.deletePromotion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PROMOTION_KEYS.promotions] });
        },
    });
};

// Toggle status mutation
export const useTogglePromotionStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => promotionService.toggleStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [PROMOTION_KEYS.promotions] });
            queryClient.invalidateQueries({ queryKey: [PROMOTION_KEYS.promotion, id] });
        },
    });
};
