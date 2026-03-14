import { axiosInstance } from "@/lib/axios";

export interface DashboardStats {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export interface MarketerStats {
    totalProducts: number;
    totalCategories: number;
    totalVouchers: number;
}

export interface RevenueChartData {
    date: string;
    revenue: number;
}

export const DashboardService = {
    getAdminStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get("/api/dashboard/stats");
        return response.data;
    },

    getMarketerStats: async (): Promise<MarketerStats> => {
        const response = await axiosInstance.get("/api/dashboard/marketer/stats");
        return response.data;
    },

    getMarketerRevenueChart: async (startDate?: string, endDate?: string): Promise<RevenueChartData[]> => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        const response = await axiosInstance.get(`/api/dashboard/marketer/revenue-chart?${params.toString()}`);
        return response.data;
    },

    getMarketerCategoryDistribution: async (): Promise<{ name: string; count: number }[]> => {
        const response = await axiosInstance.get("/api/dashboard/marketer/category-distribution");
        return response.data;
    },

    getAdminCharts: async (): Promise<{ revenueGrowth: any[]; userGrowth: any[] }> => {
        const response = await axiosInstance.get("/api/dashboard/admin/charts");
        return response.data;
    },
};
