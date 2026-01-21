using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IBannerRepository : IRepository<Banner>
    {
        Task<IEnumerable<Banner>> GetActiveBannersOrderedAsync();
        Task<Banner?> GetByOrderAsync(int order);
    }
}
