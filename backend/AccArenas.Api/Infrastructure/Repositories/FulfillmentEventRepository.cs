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
    public class FulfillmentEventRepository
        : Repository<FulfillmentEvent>,
            IFulfillmentEventRepository
    {
        public FulfillmentEventRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<FulfillmentEvent>> GetByOrderAsync(Guid orderId)
        {
            return await _dbSet
                .Include(e => e.CreatedBy)
                .Where(e => e.OrderId == orderId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();
        }
    }
}
