using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class RefreshTokenRequest
    {
        [Required(ErrorMessage = "Access token là bắt buộc")]
        public string AccessToken { get; set; } = string.Empty;

        [Required(ErrorMessage = "Refresh token là bắt buộc")]
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class RevokeTokenRequest
    {
        [Required(ErrorMessage = "Refresh token là bắt buộc")]
        public string RefreshToken { get; set; } = string.Empty;
    }
}
