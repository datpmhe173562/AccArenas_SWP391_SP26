using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<IEnumerable<Order>> GetOrdersByUserAsync(Guid userId);
        Task<IEnumerable<Order>> GetOrdersByUserWithItemsAsync(Guid userId);
        Task<Order?> GetOrderByIdWithItemsAsync(Guid orderId);
        Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status);
        Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(DateTime fromDate, DateTime toDate);
        Task<decimal> GetTotalRevenueAsync(DateTime? fromDate = null, DateTime? toDate = null);
        Task<IEnumerable<Order>> GetOrdersAssignedToAsync(Guid salesUserId);
        Task<int> CountOrdersAssignedToAsync(Guid salesUserId, string? status = null);
        Task<decimal> SumRevenueAssignedToAsync(
            Guid salesUserId,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            string? status = null
        );
    }
}
