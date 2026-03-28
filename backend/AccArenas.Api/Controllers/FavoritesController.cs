using System;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Any logged in user (Customer, Admin...) can use favorites
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyFavorites([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var count = await _favoriteService.GetUserFavoritesCountAsync(userId);
            var favorites = await _favoriteService.GetUserFavoritesAsync(userId, page, pageSize);

            return Ok(new
            {
                TotalCount = count,
                Page = page,
                PageSize = pageSize,
                Items = favorites
            });
        }

        [HttpPost("toggle/{gameAccountId}")]
        public async Task<IActionResult> ToggleFavorite(Guid gameAccountId)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var isAdded = await _favoriteService.ToggleFavoriteAsync(userId, gameAccountId);
            return Ok(new { isFavorite = isAdded, gameAccountId });
        }

        [HttpGet("check/{gameAccountId}")]
        public async Task<IActionResult> CheckIsFavorite(Guid gameAccountId)
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var isFavorite = await _favoriteService.CheckIsFavoriteAsync(userId, gameAccountId);
            return Ok(new { isFavorite, gameAccountId });
        }
    }
}
