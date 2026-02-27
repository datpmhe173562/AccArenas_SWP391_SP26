using System;
using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class SliderDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? LinkUrl { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }
    }

    public class CreateSliderRequest
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

    public class UpdateSliderRequest
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
