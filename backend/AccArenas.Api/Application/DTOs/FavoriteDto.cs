using System;

namespace AccArenas.Api.Application.DTOs
{
    public class FavoriteDto
    {
        public Guid Id { get; set; }
        public Guid GameAccountId { get; set; }
        public string Game { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
        public string? CategoryName { get; set; }
        public string? FirstImage { get; set; }
        public DateTime AddedAt { get; set; }
    }
}
