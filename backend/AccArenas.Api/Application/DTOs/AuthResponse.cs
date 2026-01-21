using System;

namespace AccArenas.Api.Application.DTOs
{
    public class AuthResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? AccessToken { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public UserInfo? User { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    public class UserInfo
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
