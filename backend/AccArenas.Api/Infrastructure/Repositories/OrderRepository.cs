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
    }
}
