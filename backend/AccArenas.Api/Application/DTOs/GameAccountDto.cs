using System;
using System.Collections.Generic;

namespace AccArenas.Api.Application.DTOs
{
    public class GameAccountDto
    {
        public Guid Id { get; set; }
        public string Game { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Rank { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "VND";
        public bool IsAvailable { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public List<string> Images { get; set; } = new();
    }

    public class CreateGameAccountRequest
    {
        public string Game { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Rank { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "VND";
        public bool IsAvailable { get; set; } = true;
        public Guid CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new();
    }

    public class UpdateGameAccountRequest
    {
        public string Game { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Rank { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; } = "VND";
        public bool IsAvailable { get; set; }
        public Guid CategoryId { get; set; }
        public List<string> ImageUrls { get; set; } = new();
    }
}
