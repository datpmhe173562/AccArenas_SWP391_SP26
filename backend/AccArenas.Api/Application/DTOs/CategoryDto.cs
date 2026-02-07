using System;

namespace AccArenas.Api.Application.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class CreateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UpdateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; }
    }
}
