import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => orderService.getMyOrders(),
    });
};

export const useOrderDetail = (id: string) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
    });
};
