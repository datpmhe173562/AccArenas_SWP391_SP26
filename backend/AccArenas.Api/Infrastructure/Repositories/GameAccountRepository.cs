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
    public class GameAccountRepository : Repository<GameAccount>, IGameAccountRepository
    {
        public GameAccountRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<GameAccount>> GetAvailableAccountsAsync()
        {
            return await _dbSet
                .Where(g => g.IsAvailable)
                .Include(g => g.Category)
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameAccount>> GetAccountsByGameAsync(string game)
        {
            return await _dbSet
                .Where(g => g.Game.ToLower() == game.ToLower() && g.IsAvailable)
                .Include(g => g.Category)
                .OrderBy(g => g.Price)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameAccount>> GetAccountsByCategoryAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(g => g.CategoryId == categoryId && g.IsAvailable)
                .Include(g => g.Category)
                .OrderBy(g => g.Price)
                .ToListAsync();
        }

        public async Task<IEnumerable<GameAccount>> GetAccountsByPriceRangeAsync(
            decimal minPrice,
            decimal maxPrice
        )
        {
            return await _dbSet
                .Where(g => g.Price >= minPrice && g.Price <= maxPrice && g.IsAvailable)
                .Include(g => g.Category)
                .OrderBy(g => g.Price)
                .ToListAsync();
        }

        public async Task<GameAccount?> GetByAccountNameAsync(string accountName)
        {
            return await _dbSet
                .Include(g => g.Category)
                .FirstOrDefaultAsync(g => g.AccountName.ToLower() == accountName.ToLower());
        }
    }
}
