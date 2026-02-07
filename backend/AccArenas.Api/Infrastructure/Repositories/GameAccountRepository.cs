using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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

        public override async Task<GameAccount?> GetByIdAsync(Guid id)
        {
            return await _dbSet
                .Include(g => g.Category)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

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

        public override async Task<(IEnumerable<GameAccount> Items, int TotalCount)> GetPagedAsync(
            int pageNumber,
            int pageSize,
            Expression<Func<GameAccount, bool>>? predicate = null,
            Expression<Func<GameAccount, object>>? orderBy = null,
            bool orderByDescending = false
        )
        {
            IQueryable<GameAccount> query = _dbSet.Include(g => g.Category);

            if (predicate != null)
                query = query.Where(predicate);

            var totalCount = await query.CountAsync();

            if (orderBy != null)
            {
                query = orderByDescending
                    ? query.OrderByDescending(orderBy)
                    : query.OrderBy(orderBy);
            }
            else
            {
                query = query.OrderByDescending(g => g.CreatedAt);
            }

            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return (items, totalCount);
        }

        public async Task<GameAccount?> GetByAccountNameAsync(string accountName)
        {
            return await _dbSet
                .Include(g => g.Category)
                .FirstOrDefaultAsync(g => g.AccountName.ToLower() == accountName.ToLower());
        }
    }
}
