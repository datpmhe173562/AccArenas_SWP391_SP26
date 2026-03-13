using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IFulfillmentEventRepository : IRepository<FulfillmentEvent>
    {
        Task<IEnumerable<FulfillmentEvent>> GetByOrderAsync(Guid orderId);
    }
}
