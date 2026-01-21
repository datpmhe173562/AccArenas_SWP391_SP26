using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface ISliderRepository : IRepository<Slider>
    {
        Task<IEnumerable<Slider>> GetActiveSlidersOrderedAsync();
        Task<Slider?> GetByOrderAsync(int order);
    }
}
