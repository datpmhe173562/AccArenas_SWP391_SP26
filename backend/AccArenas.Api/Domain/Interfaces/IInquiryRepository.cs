using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IInquiryRepository : IRepository<Inquiry>
    {
        Task<IEnumerable<Inquiry>> GetByOrderAsync(Guid orderId);
        Task<IEnumerable<Inquiry>> GetBySalesUserAsync(Guid salesUserId);
        Task<Inquiry?> GetWithMessagesAsync(Guid id);
    }
}
