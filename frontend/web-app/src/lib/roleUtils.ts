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

export const canAccessAdmin = (user: UserInfo | null): boolean => {
    return isAdmin(user);
};

export const canAccessMarketer = (user: UserInfo | null): boolean => {
    return hasAnyRole(user, ["Admin", "MarketingStaff"]);
};

export const isPrimaryMarketer = (user: UserInfo | null): boolean => {
    return isMarketer(user) && !isAdmin(user);
};

export const getManagementRoute = (user: UserInfo | null): string => {
    // Nếu user có role marketer và KHÔNG có role admin, dẫn đến marketer
    if (isMarketer(user) && !isAdmin(user)) {
        return "/marketer";
    }
    // Nếu user có role admin (có thể có cả marketer), dẫn đến admin  
    if (isAdmin(user)) {
        return "/admin";
    }
    return "/";
};