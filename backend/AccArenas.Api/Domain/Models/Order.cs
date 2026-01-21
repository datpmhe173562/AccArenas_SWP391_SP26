using System;
using System.Collections.Generic;

namespace AccArenas.Api.Domain.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Paid, Delivered, Refunded
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "VND";
        public List<OrderItem> Items { get; set; } = new();
    }

    public class OrderItem
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public Guid GameAccountId { get; set; }
        public GameAccount? GameAccount { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
