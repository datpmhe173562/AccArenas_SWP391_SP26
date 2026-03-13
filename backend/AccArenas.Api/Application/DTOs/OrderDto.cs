using System;
using System.Collections.Generic;

namespace AccArenas.Api.Application.DTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public Guid? AssignedToSalesId { get; set; }
        public string? AssignedSalesName { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string FulfillmentStatus { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new();
        public List<FulfillmentEventDto> Events { get; set; } = new();
    }

    public class OrderItemDto
    {
        public Guid Id { get; set; }
        public Guid GameAccountId { get; set; }
        public string GameAccountName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }

    public class FulfillmentEventDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
        public Guid CreatedByUserId { get; set; }
        public string? CreatedByName { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateOrderRequest
    {
        public List<Guid> GameAccountIds { get; set; } = new();
        public string? PromotionCode { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class InquiryDto
    {
        public Guid Id { get; set; }
        public Guid OrderId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<InquiryMessageDto> Messages { get; set; } = new();
    }

    public class InquiryMessageDto
    {
        public Guid Id { get; set; }
        public Guid SenderUserId { get; set; }
        public string? SenderName { get; set; }
        public string SenderRole { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ReplyInquiryRequest
    {
        public string Message { get; set; } = string.Empty;
    }
}
