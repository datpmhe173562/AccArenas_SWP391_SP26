using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Application.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly ApplicationDbContext _context;

        public FavoriteService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ToggleFavoriteAsync(Guid userId, Guid gameAccountId)
        {
            var existing = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.GameAccountId == gameAccountId);

            if (existing != null)
            {
                _context.Favorites.Remove(existing);
                await _context.SaveChangesAsync();
                return false; // Removed
            }
            else
            {
                var favorite = new Favorite
                {
                    UserId = userId,
                    GameAccountId = gameAccountId,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Favorites.Add(favorite);
                await _context.SaveChangesAsync();
                return true; // Added
            }
        }

        public async Task<List<FavoriteDto>> GetUserFavoritesAsync(Guid userId, int page = 1, int pageSize = 20)
        {
            return await _context.Favorites
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(f => f.GameAccount)
                .ThenInclude(g => g!.Category)
                .Select(f => new FavoriteDto
                {
                    Id = f.Id,
                    GameAccountId = f.GameAccountId,
                    Game = f.GameAccount!.Game,
                    AccountName = f.GameAccount.AccountName,
                    Price = f.GameAccount.Price,
                    IsAvailable = f.GameAccount.IsAvailable,
                    CategoryName = f.GameAccount.Category != null ? f.GameAccount.Category.Name : null,
                    FirstImage = f.GameAccount.Images.FirstOrDefault(),
                    AddedAt = f.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<int> GetUserFavoritesCountAsync(Guid userId)
        {
            return await _context.Favorites.CountAsync(f => f.UserId == userId);
        }

        public async Task<bool> CheckIsFavoriteAsync(Guid userId, Guid gameAccountId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.GameAccountId == gameAccountId);
        }
    }
}
