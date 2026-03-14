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
    public class InquiryRepository : Repository<Inquiry>, IInquiryRepository
    {
        public InquiryRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<Inquiry>> GetByOrderAsync(Guid orderId)
        {
            return await _dbSet
                .Include(i => i.Messages)
                    .ThenInclude(m => m.Sender)
                .Where(i => i.OrderId == orderId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Inquiry>> GetBySalesUserAsync(Guid salesUserId)
        {
            return await _dbSet
                .Include(i => i.Order)
                .Include(i => i.Messages)
                    .ThenInclude(m => m.Sender)
                .Where(i => i.Order != null && i.Order.AssignedToSalesId == salesUserId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Inquiry>> GetByCustomerAsync(Guid customerUserId)
        {
            return await _dbSet
                .Include(i => i.Messages)
                    .ThenInclude(m => m.Sender)
                .Where(i => i.CustomerUserId == customerUserId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<Inquiry?> GetWithMessagesAsync(Guid id)
        {
            return await _dbSet
                .Include(i => i.Order)
                .Include(i => i.Messages)
                    .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<IEnumerable<Inquiry>> GetAllInquiriesWithMessagesAsync()
        {
            return await _dbSet
                .Include(i => i.Order)
                .Include(i => i.Messages)
                    .ThenInclude(m => m.Sender)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }
    }
}
