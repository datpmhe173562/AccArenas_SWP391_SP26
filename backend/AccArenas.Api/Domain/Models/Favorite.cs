using System;

namespace AccArenas.Api.Domain.Models
{
    public class Favorite
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public Guid GameAccountId { get; set; }
        public GameAccount? GameAccount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
