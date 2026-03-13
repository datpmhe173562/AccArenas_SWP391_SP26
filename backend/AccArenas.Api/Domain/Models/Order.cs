using System;
using System.Collections.Generic;

namespace AccArenas.Api.Domain.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public ApplicationUser? User { get; set; }
        public Guid? AssignedToSalesId { get; set; }
        public ApplicationUser? AssignedSales { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Payment status: Pending, Paid, Failed, Delivered
        public string FulfillmentStatus { get; set; } = "Pending"; // Fulfillment status for Sales: Pending, Processing, Delivered, Failed
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = "VND";
        public List<OrderItem> Items { get; set; } = new();
        public List<FulfillmentEvent> FulfillmentEvents { get; set; } = new();
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

    public class FulfillmentEvent
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
        public Guid CreatedByUserId { get; set; }
        public ApplicationUser? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Inquiry
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public Guid CustomerUserId { get; set; }
        public ApplicationUser? Customer { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = "Open"; // Open, WaitingCustomer, Resolved, Closed
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public List<InquiryMessage> Messages { get; set; } = new();
    }

    public class InquiryMessage
    {
        public Guid Id { get; set; }
        public Guid InquiryId { get; set; }
        public Inquiry? Inquiry { get; set; }
        public Guid SenderUserId { get; set; }
        public ApplicationUser? Sender { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string SenderRole { get; set; } = string.Empty; // Customer, Sales, Admin
    }
}
