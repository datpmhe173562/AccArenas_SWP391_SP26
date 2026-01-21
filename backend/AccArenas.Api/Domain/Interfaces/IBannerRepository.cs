using AccArenas.Api.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IBannerRepository : IRepository<Banner>
    {
        Task<IEnumerable<Banner>> GetActiveBannersOrderedAsync();
        Task<Banner?> GetByOrderAsync(int order);
    }
}