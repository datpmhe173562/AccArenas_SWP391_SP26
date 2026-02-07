using System;

namespace AccArenas.Api.Domain.Models
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
