using System;
using System.ComponentModel.DataAnnotations;

namespace AccArenas.Api.Application.DTOs
{
    public class BlogPostDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public bool IsPublished { get; set; }
        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }

    public class CreateBlogPostRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Tiêu đề không được quá 500 ký tự")]
        public string Title { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Slug không được quá 500 ký tự")]
        public string? Slug { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public Guid CategoryId { get; set; }

        public bool IsPublished { get; set; } = false;
    }

    public class UpdateBlogPostRequest
    {
        [Required]
        [StringLength(500, ErrorMessage = "Tiêu đề không được quá 500 ký tự")]
        public string Title { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Slug không được quá 500 ký tự")]
        public string? Slug { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        [Required]
        public Guid CategoryId { get; set; }

        public bool IsPublished { get; set; } = false;
    }
}
