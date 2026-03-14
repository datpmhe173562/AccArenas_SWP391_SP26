import { UserInfo } from "@/types/generated-api";

export const hasRole = (user: UserInfo | null, role: string): boolean => {
    return user?.roles?.includes(role) || false;
};

export const hasAnyRole = (user: UserInfo | null, roles: string[]): boolean => {
    return roles.some(role => hasRole(user, role));
};

export const isAdmin = (user: UserInfo | null): boolean => {
    return hasRole(user, "Admin");
};

export const isMarketer = (user: UserInfo | null): boolean => {
    return hasRole(user, "MarketingStaff");
};

export const isSalesStaff = (user: UserInfo | null): boolean => {
    return hasRole(user, "SalesStaff");
};

export const isCustomer = (user: UserInfo | null): boolean => {
    return hasRole(user, "Customer");
};

export const canAccessAdmin = (user: UserInfo | null): boolean => {
    return isAdmin(user);
};

export const canAccessMarketer = (user: UserInfo | null): boolean => {
    return hasAnyRole(user, ["Admin", "MarketingStaff"]);
};

export const canAccessSales = (user: UserInfo | null): boolean => {
    return hasAnyRole(user, ["Admin", "SalesStaff"]);
};

export const isPrimaryMarketer = (user: UserInfo | null): boolean => {
    return isMarketer(user) && !isAdmin(user);
};

export const getManagementRoute = (user: UserInfo | null): string => {
    // 1. Phải là SalesStaff nhưng KHÔNG phải Admin thì ưu tiên Sales Portal
    if (isSalesStaff(user) && !isAdmin(user)) {
        return "/sales";
    }
    // 2. Nếu là Marketer nhưng KHÔNG phải Admin thì ưu tiên Marketer Portal
    if (isMarketer(user) && !isAdmin(user)) {
        return "/marketer";
    }
    // 3. Nếu là Admin thì dẫn đến Admin Dashboard
    if (isAdmin(user)) {
        return "/admin";
    }
    return "/";
};