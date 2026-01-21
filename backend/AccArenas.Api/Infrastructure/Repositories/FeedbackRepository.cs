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
    public class FeedbackRepository : Repository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Feedback>> GetByUserAsync(Guid userId)
        {
            return await _dbSet
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Feedback>> GetByOrderAsync(Guid orderId)
        {
            return await _dbSet
                .Where(f => f.OrderId == orderId)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();
        }

        public async Task<double> GetAverageRatingAsync(Guid? gameAccountId = null)
        {
            var query = _dbSet.AsQueryable();

            if (gameAccountId.HasValue)
            {
                query = query.Where(f =>
                    _context
                        .Set<Order>()
                        .Where(o =>
                            o.Id == f.OrderId
                            && o.Items.Any(item => item.GameAccountId == gameAccountId.Value)
                        )
                        .Any()
                );
            }

            return await query.AverageAsync(f => (double)f.Rating);
        }
    }
}
