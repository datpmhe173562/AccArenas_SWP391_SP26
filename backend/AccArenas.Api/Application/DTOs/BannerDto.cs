using System;
using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class BannerDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? LinkUrl { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
    }

    public class CreateBannerRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Tiêu đề không được quá 500 ký tự")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000, ErrorMessage = "URL ảnh không được quá 2000 ký tự")]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Link URL không được quá 2000 ký tự")]
        public string? LinkUrl { get; set; }

        public bool IsActive { get; set; } = true;

        [Range(0, int.MaxValue, ErrorMessage = "Thứ tự phải là số không âm")]
        public int Order { get; set; } = 0;
    }

    public class UpdateBannerRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Tiêu đề không được quá 500 ký tự")]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(2000, ErrorMessage = "URL ảnh không được quá 2000 ký tự")]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Link URL không được quá 2000 ký tự")]
        public string? LinkUrl { get; set; }

        public bool IsActive { get; set; } = true;

        [Range(0, int.MaxValue, ErrorMessage = "Thứ tự phải là số không âm")]
        public int Order { get; set; } = 0;
    }
}
