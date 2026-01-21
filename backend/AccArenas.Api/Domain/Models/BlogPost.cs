using System;

namespace AccArenas.Api.Domain.Models
{
    public class BlogPost
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PublishedAt { get; set; }
        public bool IsPublished { get; set; } = false;
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
