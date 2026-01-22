using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class PromotionDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal DiscountPercent { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class CreatePromotionRequest
    {
        [Required]
        [StringLength(50, ErrorMessage = "Mã khuyến mãi không được quá 50 ký tự")]
        public string Code { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Mô tả không được quá 500 ký tự")]
        public string? Description { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "Phần trăm giảm giá phải từ 0 đến 100")]
        public decimal DiscountPercent { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class UpdatePromotionRequest
    {
        [Required]
        [StringLength(50, ErrorMessage = "Mã khuyến mãi không được quá 50 ký tự")]
        public string Code { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Mô tả không được quá 500 ký tự")]
        public string? Description { get; set; }

        [Required]
        [Range(0, 100, ErrorMessage = "Phần trăm giảm giá phải từ 0 đến 100")]
        public decimal DiscountPercent { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class PromotionQueryRequest
    {
        public string? Code { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
