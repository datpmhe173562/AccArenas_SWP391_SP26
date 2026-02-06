using System;

namespace AccArenas.Api.Domain.Models
{
    public class GameAccount
    {
        public Guid Id { get; set; }
        public string Game { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; public string? Rank { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "VND";
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
