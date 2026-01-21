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
    public class PromotionRepository : Repository<Promotion>, IPromotionRepository
    {
        public PromotionRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Promotion>> GetActivePromotionsAsync()
        {
            var currentDate = DateTime.UtcNow;
            return await _dbSet
                .Where(p => p.IsActive && p.StartDate <= currentDate && p.EndDate >= currentDate)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<Promotion?> GetByCodeAsync(string code)
        {
            return await _dbSet.FirstOrDefaultAsync(p => p.Code.ToLower() == code.ToLower());
        }

        public async Task<IEnumerable<Promotion>> GetPromotionsByValidDateAsync(DateTime date)
        {
            return await _dbSet
                .Where(p => p.StartDate <= date && p.EndDate >= date && p.IsActive)
                .OrderByDescending(p => p.DiscountPercent)
                .ToListAsync();
        }
    }
}
