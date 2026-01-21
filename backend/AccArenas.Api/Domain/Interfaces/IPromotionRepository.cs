using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IPromotionRepository : IRepository<Promotion>
    {
        Task<IEnumerable<Promotion>> GetActivePromotionsAsync();
        Task<Promotion?> GetByCodeAsync(string code);
        Task<IEnumerable<Promotion>> GetPromotionsByValidDateAsync(DateTime date);
    }
}
