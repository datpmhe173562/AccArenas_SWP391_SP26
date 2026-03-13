using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Infrastructure.Repositories
{
    public class OrderRepository : Repository<Order>, IOrderRepository
    {
        public OrderRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Order>> GetOrdersByUserAsync(Guid userId)
        {
            return await _dbSet
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByUserWithItemsAsync(Guid userId)
        {
            return await _dbSet
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.GameAccount)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order?> GetOrderByIdWithItemsAsync(Guid orderId)
        {
            return await _dbSet
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.GameAccount)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(string status)
        {
            return await _dbSet
                .Where(o => o.Status.ToLower() == status.ToLower())
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetOrdersByDateRangeAsync(
            DateTime fromDate,
            DateTime toDate
        )
        {
            return await _dbSet
                .Where(o => o.CreatedAt.Date >= fromDate.Date && o.CreatedAt.Date <= toDate.Date)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<decimal> GetTotalRevenueAsync(
            DateTime? fromDate = null,
            DateTime? toDate = null
        )
        {
            var query = _dbSet.Where(o => o.Status.ToLower() == "completed");

            if (fromDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date >= fromDate.Value.Date);

            if (toDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date <= toDate.Value.Date);

            return await query.SumAsync(o => o.TotalAmount);
        }

        public async Task<IEnumerable<Order>> GetOrdersAssignedToAsync(Guid salesUserId)
        {
            return await _dbSet
                .Include(o => o.Items)
                    .ThenInclude(oi => oi.GameAccount)
                .Include(o => o.FulfillmentEvents)
                .Include(o => o.AssignedSales)
                .Where(o => o.AssignedToSalesId == salesUserId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<int> CountOrdersAssignedToAsync(Guid salesUserId, string? status = null)
        {
            var query = _dbSet.AsQueryable().Where(o => o.AssignedToSalesId == salesUserId);

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => o.Status.ToLower() == status.ToLower());
            }

            return await query.CountAsync();
        }

        public async Task<decimal> SumRevenueAssignedToAsync(
            Guid salesUserId,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            string? status = null
        )
        {
            var query = _dbSet.AsQueryable().Where(o => o.AssignedToSalesId == salesUserId);

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => o.Status.ToLower() == status.ToLower());
            }

            if (fromDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date >= fromDate.Value.Date);

            if (toDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date <= toDate.Value.Date);

            return await query.SumAsync(o => o.TotalAmount);
        }
    }
}
