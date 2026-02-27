using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AccArenas.Api.Application.Services
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public JwtService(
            IConfiguration configuration,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager
        )
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
        }

        public async Task<(
            string AccessToken,
            string RefreshToken,
            DateTime ExpiresAt
        )> GenerateTokensAsync(
            ApplicationUser user,
            IList<string> roles,
            string? ipAddress = null,
            string? deviceInfo = null
        )
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    jwtSettings["SecretKey"]
                        ?? "AccArenas-Super-Secret-JWT-Key-For-Game-Account-Website-2026"
                )
            );
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(
                    JwtRegisteredClaimNames.Iat,
                    DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64
                ),
            };

            // Add user info
            if (!string.IsNullOrEmpty(user.FullName))
            {
                claims.Add(new Claim(ClaimTypes.Name, user.FullName));
            }

            // Add roles
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var expirationMinutes = int.Parse(jwtSettings["ExpirationMinutes"] ?? "30");
            var now = DateTime.UtcNow;
            var expiresAt = now.AddMinutes(expirationMinutes);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"] ?? "AccArenas",
                audience: jwtSettings["Audience"] ?? "AccArenas-Users",
                claims: claims,
                notBefore: now,
                expires: expiresAt,
                signingCredentials: credentials
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            var refreshToken = await GenerateRefreshTokenAsync();

            // Save refresh token to database
            await SaveRefreshTokenAsync(user.Id.ToString(), refreshToken, ipAddress, deviceInfo);

            return (accessToken, refreshToken, expiresAt);
        }

        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        jwtSettings["SecretKey"]
                            ?? "AccArenas-Super-Secret-JWT-Key-For-Game-Account-Website-2026"
                    )
                );

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"] ?? "AccArenas",
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"] ?? "AccArenas-Users",
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, validationParameters, out _);

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public Task<string> GenerateRefreshTokenAsync()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Task.FromResult(Convert.ToBase64String(randomBytes));
        }

        public async Task<bool> ValidateRefreshTokenAsync(string refreshToken, string userId)
        {
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(rt =>
                rt.Token == refreshToken && rt.UserId.ToString() == userId
            );

            return token != null && token.IsActive;
        }

        public async Task SaveRefreshTokenAsync(
            string userId,
            string refreshToken,
            string? ipAddress = null,
            string? deviceInfo = null
        )
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var expirationDays = int.Parse(jwtSettings["RefreshTokenExpirationDays"] ?? "7");

            var refreshTokenEntity = new RefreshToken
            {
                Id = Guid.NewGuid(),
                Token = refreshToken,
                UserId = Guid.Parse(userId),
                ExpiryDate = DateTime.UtcNow.AddDays(expirationDays),
                CreatedAt = DateTime.UtcNow,
                IpAddress = ipAddress,
                DeviceInfo = deviceInfo,
            };

            _context.RefreshTokens.Add(refreshTokenEntity);
            await _context.SaveChangesAsync();
        }

        public async Task RevokeRefreshTokenAsync(string refreshToken)
        {
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(rt =>
                rt.Token == refreshToken
            );

            if (token != null)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RevokeAllUserTokensAsync(string userId)
        {
            var tokens = await _context
                .RefreshTokens.Where(rt => rt.UserId.ToString() == userId && rt.IsActive)
                .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }

        public async Task<ApplicationUser?> GetUserFromExpiredTokenAsync(string expiredAccessToken)
        {
            try
            {
                var jwtSettings = _configuration.GetSection("JwtSettings");
                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        jwtSettings["SecretKey"]
                            ?? "AccArenas-Super-Secret-JWT-Key-For-Game-Account-Website-2026"
                    )
                );

                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = true,
                    ValidIssuer = jwtSettings["Issuer"] ?? "AccArenas",
                    ValidateAudience = true,
                    ValidAudience = jwtSettings["Audience"] ?? "AccArenas-Users",
                    ValidateLifetime = false, // Important: Don't validate expiry for expired tokens
                    ClockSkew = TimeSpan.Zero,
                };

                var principal = tokenHandler.ValidateToken(
                    expiredAccessToken,
                    validationParameters,
                    out SecurityToken validatedToken
                );

                var jwtToken = validatedToken as JwtSecurityToken;
                if (
                    jwtToken == null
                    || !jwtToken.Header.Alg.Equals(
                        SecurityAlgorithms.HmacSha256,
                        StringComparison.InvariantCultureIgnoreCase
                    )
                )
                {
                    return null;
                }

                var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return null;
                }

                return await _userManager.FindByIdAsync(userId.ToString());
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task CleanupExpiredTokensAsync()
        {
            var expiredTokens = await _context
                .RefreshTokens.Where(rt => rt.ExpiryDate < DateTime.UtcNow)
                .ToListAsync();

            _context.RefreshTokens.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}
