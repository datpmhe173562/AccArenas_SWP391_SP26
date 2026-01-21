using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IGameAccountRepository : IRepository<GameAccount>
    {
        Task<IEnumerable<GameAccount>> GetAvailableAccountsAsync();
        Task<IEnumerable<GameAccount>> GetAccountsByGameAsync(string game);
        Task<IEnumerable<GameAccount>> GetAccountsByCategoryAsync(Guid categoryId);
        Task<IEnumerable<GameAccount>> GetAccountsByPriceRangeAsync(
            decimal minPrice,
            decimal maxPrice
        );
        Task<GameAccount?> GetByAccountNameAsync(string accountName);
    }
}
