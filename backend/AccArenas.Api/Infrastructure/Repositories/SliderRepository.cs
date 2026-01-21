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
    public class SliderRepository : Repository<Slider>, ISliderRepository
    {
        public SliderRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Slider>> GetActiveSlidersOrderedAsync()
        {
            return await _dbSet.Where(s => s.IsActive).OrderBy(s => s.Order).ToListAsync();
        }

        public async Task<Slider?> GetByOrderAsync(int order)
        {
            return await _dbSet.FirstOrDefaultAsync(s => s.Order == order);
        }
    }
}
