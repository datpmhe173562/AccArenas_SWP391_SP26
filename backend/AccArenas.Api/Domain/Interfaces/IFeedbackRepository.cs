using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IFeedbackRepository : IRepository<Feedback>
    {
        Task<IEnumerable<Feedback>> GetByUserAsync(Guid userId);
        Task<IEnumerable<Feedback>> GetByOrderAsync(Guid orderId);
        Task<IEnumerable<Feedback>> GetBySalesUserAsync(Guid salesUserId);
        Task<double> GetAverageRatingAsync(Guid? gameAccountId = null);
    }
}
