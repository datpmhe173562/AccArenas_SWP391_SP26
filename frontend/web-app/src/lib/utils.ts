export const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(Number(amount))) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
};
