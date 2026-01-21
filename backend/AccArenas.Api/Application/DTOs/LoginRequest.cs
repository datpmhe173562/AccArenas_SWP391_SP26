using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Email hoặc tên đăng nhập là bắt buộc")]
        public string UsernameOrEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; } = false;
    }
}
