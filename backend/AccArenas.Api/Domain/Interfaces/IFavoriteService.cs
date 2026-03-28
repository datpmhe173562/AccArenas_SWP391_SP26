using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IFavoriteService
    {
        Task<bool> ToggleFavoriteAsync(Guid userId, Guid gameAccountId);
        Task<List<FavoriteDto>> GetUserFavoritesAsync(Guid userId, int page = 1, int pageSize = 20);
        Task<int> GetUserFavoritesCountAsync(Guid userId);
        Task<bool> CheckIsFavoriteAsync(Guid userId, Guid gameAccountId);
    }
}
