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
    public class BannerRepository : Repository<Banner>, IBannerRepository
    {
        public BannerRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Banner>> GetActiveBannersOrderedAsync()
        {
            return await _dbSet.Where(b => b.IsActive).OrderBy(b => b.Order).ToListAsync();
        }

        public async Task<Banner?> GetByOrderAsync(int order)
        {
            return await _dbSet.FirstOrDefaultAsync(b => b.Order == order);
        }
    }
}
