using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IJwtService
    {
        Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> GenerateTokensAsync(
            ApplicationUser user,
            IList<string> roles,
            string? ipAddress = null,
            string? deviceInfo = null
        );

        Task<bool> ValidateRefreshTokenAsync(string refreshToken, string userId);
        Task RevokeRefreshTokenAsync(string refreshToken);
        Task RevokeAllUserTokensAsync(string userId);
        Task<ApplicationUser?> GetUserFromExpiredTokenAsync(string expiredAccessToken);
        Task CleanupExpiredTokensAsync();
    }
}
