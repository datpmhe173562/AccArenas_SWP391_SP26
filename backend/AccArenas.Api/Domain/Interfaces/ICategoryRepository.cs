using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface ICategoryRepository : IRepository<Category>
    {
        Task<IEnumerable<Category>> GetActiveCategoriesAsync();
        Task<Category?> GetByNameAsync(string name);
        Task<bool> HasGameAccountsAsync(Guid categoryId);
    }
}
