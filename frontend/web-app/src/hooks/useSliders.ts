import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sliderService } from '@/services/sliderService';
import { CreateSliderRequest, UpdateSliderRequest } from '@/types/generated-api';

const QUERY_KEYS = {
    sliders: 'sliders',
    slider: 'slider',
} as const;

export const useSliders = (page = 1, pageSize = 10, isActive?: boolean) => {
    return useQuery({
        queryKey: [QUERY_KEYS.sliders, { page, pageSize, isActive }],
        queryFn: () => sliderService.getSliders(page, pageSize, isActive),
    });
};

export const useSlider = (id: string, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.slider, id],
        queryFn: () => sliderService.getSliderById(id),
        enabled: enabled && !!id,
    });
};

export const useCreateSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateSliderRequest) => sliderService.createSlider(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sliders] });
        },
    });
};

export const useUpdateSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateSliderRequest }) =>
            sliderService.updateSlider(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sliders] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.slider, id] });
        },
    });
};

export const useDeleteSlider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => sliderService.deleteSlider(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sliders] });
        },
    });
};

export const useToggleSliderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => sliderService.toggleSliderStatus(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.sliders] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.slider, id] });
        },
    });
};
