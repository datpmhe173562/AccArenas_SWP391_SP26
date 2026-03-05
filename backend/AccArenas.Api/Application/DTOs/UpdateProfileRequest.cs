using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class UpdateProfileRequest
    {
        [StringLength(100, ErrorMessage = "Họ tên không được vượt quá 100 ký tự")]
        public string? FullName { get; set; }

        [StringLength(20, ErrorMessage = "Số điện thoại không được vượt quá 20 ký tự")]
        [RegularExpression(@"^(0|[1-9][0-9]*)$", ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? PhoneNumber { get; set; }
    }
}
