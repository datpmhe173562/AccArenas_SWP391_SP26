using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/sales")]
    [Authorize(Roles = "SalesStaff")]
    public class SalesController : ControllerBase
    {
        private static readonly HashSet<string> AllowedStatuses = new(
            StringComparer.OrdinalIgnoreCase
        )
        {
            "Pending",
            "Paid",
            "Processing",
            "Delivered",
            "Failed",
        };

        private readonly IUnitOfWork _unitOfWork;

        public SalesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetAssignedOrders()
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            var orders = await _unitOfWork.Orders.GetOrdersAssignedToAsync(salesUserId.Value);
            var dto = orders.Select(MapOrderToDto);
            return Ok(new ApiResponse<IEnumerable<OrderDto>> { Success = true, Data = dto });
        }

        [HttpPatch("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
            Guid id,
            [FromBody] UpdateOrderStatusRequest request
        )
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            if (request == null || string.IsNullOrWhiteSpace(request.Status))
            {
                return BadRequest(
                    new ApiResponse<string> { Success = false, Message = "Invalid status" }
                );
            }

            if (!AllowedStatuses.Contains(request.Status))
            {
                return BadRequest(
                    new ApiResponse<string> { Success = false, Message = "Unsupported status" }
                );
            }

            var order = await _unitOfWork.Orders.GetOrderByIdWithItemsAsync(id);
            if (order == null || order.AssignedToSalesId != salesUserId)
            {
                return NotFound(
                    new ApiResponse<string>
                    {
                        Success = false,
                        Message = "Order not found or not assigned to you",
                    }
                );
            }

            if (!IsAllowedTransition(order.Status, request.Status))
            {
                return BadRequest(
                    new ApiResponse<string> { Success = false, Message = "Invalid transition" }
                );
            }

            order.Status = request.Status;
            order.FulfillmentStatus = request.Status;

            await _unitOfWork.FulfillmentEvents.AddAsync(
                new FulfillmentEvent
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    Status = request.Status,
                    Note = request.Reason,
                    CreatedByUserId = salesUserId.Value,
                    CreatedAt = DateTime.UtcNow,
                }
            );

            _unitOfWork.Orders.Update(order);
            await _unitOfWork.SaveChangesAsync();

            var updated = await _unitOfWork.Orders.GetOrderByIdWithItemsAsync(id);
            var dto = MapOrderToDto(updated!);
            return Ok(
                new ApiResponse<OrderDto>
                {
                    Success = true,
                    Data = dto,
                    Message = "Cập nhật trạng thái thành công",
                }
            );
        }

        [HttpPost("orders/{id}/note")]
        public async Task<IActionResult> AddFulfillmentNote(
            Guid id,
            [FromBody] FulfillmentNoteRequest request
        )
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            if (request == null || string.IsNullOrWhiteSpace(request.Note))
            {
                return BadRequest(
                    new ApiResponse<string> { Success = false, Message = "Note is required" }
                );
            }

            var order = await _unitOfWork.Orders.GetOrderByIdWithItemsAsync(id);
            if (order == null || order.AssignedToSalesId != salesUserId)
            {
                return NotFound(
                    new ApiResponse<string>
                    {
                        Success = false,
                        Message = "Order not found or not assigned to you",
                    }
                );
            }

            await _unitOfWork.FulfillmentEvents.AddAsync(
                new FulfillmentEvent
                {
                    Id = Guid.NewGuid(),
                    OrderId = order.Id,
                    Status = order.FulfillmentStatus,
                    Note = request.Note,
                    CreatedByUserId = salesUserId.Value,
                    CreatedAt = DateTime.UtcNow,
                }
            );

            await _unitOfWork.SaveChangesAsync();

            var timeline = await _unitOfWork.FulfillmentEvents.GetByOrderAsync(order.Id);
            var timelineDto = timeline.Select(e => new FulfillmentEventDto
            {
                Id = e.Id,
                Status = e.Status,
                Note = e.Note,
                CreatedByUserId = e.CreatedByUserId,
                CreatedByName = e.CreatedBy?.FullName ?? e.CreatedBy?.UserName,
                CreatedAt = e.CreatedAt,
            });

            return Ok(
                new ApiResponse<IEnumerable<FulfillmentEventDto>>
                {
                    Success = true,
                    Data = timelineDto,
                    Message = "Đã thêm ghi chú",
                }
            );
        }

        [HttpGet("orders/{id}/timeline")]
        public async Task<IActionResult> GetTimeline(Guid id)
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            var order = await _unitOfWork.Orders.GetOrderByIdWithItemsAsync(id);
            if (order == null || order.AssignedToSalesId != salesUserId)
            {
                return NotFound(
                    new ApiResponse<string>
                    {
                        Success = false,
                        Message = "Order not found or not assigned to you",
                    }
                );
            }

            var timeline = await _unitOfWork.FulfillmentEvents.GetByOrderAsync(order.Id);
            var timelineDto = timeline.Select(e => new FulfillmentEventDto
            {
                Id = e.Id,
                Status = e.Status,
                Note = e.Note,
                CreatedByUserId = e.CreatedByUserId,
                CreatedByName = e.CreatedBy?.FullName ?? e.CreatedBy?.UserName,
                CreatedAt = e.CreatedAt,
            });

            return Ok(
                new ApiResponse<IEnumerable<FulfillmentEventDto>>
                {
                    Success = true,
                    Data = timelineDto,
                }
            );
        }

        [HttpGet("stats/me")]
        public async Task<IActionResult> GetMyStats()
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            var orders = await _unitOfWork.Orders.GetOrdersAssignedToAsync(salesUserId.Value);
            var delivered = orders
                .Where(o => o.Status.Equals("Delivered", StringComparison.OrdinalIgnoreCase))
                .ToList();
            var pending = orders
                .Where(o => o.Status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
                .Count();
            var processing = orders
                .Where(o => o.Status.Equals("Processing", StringComparison.OrdinalIgnoreCase))
                .Count();
            var failed = orders
                .Where(o => o.Status.Equals("Failed", StringComparison.OrdinalIgnoreCase))
                .Count();

            var stats = new
            {
                totalOrders = orders.Count(),
                delivered = delivered.Count,
                pending,
                processing,
                failed,
                revenueDelivered = delivered.Sum(o => o.TotalAmount),
            };

            return Ok(new ApiResponse<object> { Success = true, Data = stats });
        }

        [HttpGet("inquiries")]
        public async Task<IActionResult> GetMyInquiries()
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            var inquiries = await _unitOfWork.Inquiries.GetBySalesUserAsync(salesUserId.Value);
            var dto = inquiries.Select(MapInquiryToDto);
            return Ok(new ApiResponse<IEnumerable<InquiryDto>> { Success = true, Data = dto });
        }

        [HttpGet("inquiries/{id}")]
        public async Task<IActionResult> GetInquiry(Guid id)
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            var inquiry = await _unitOfWork.Inquiries.GetWithMessagesAsync(id);
            if (
                inquiry == null
                || inquiry.Order == null
                || inquiry.Order.AssignedToSalesId != salesUserId
            )
            {
                return NotFound(
                    new ApiResponse<string> { Success = false, Message = "Inquiry not found" }
                );
            }

            return Ok(
                new ApiResponse<InquiryDto> { Success = true, Data = MapInquiryToDto(inquiry) }
            );
        }

        [HttpPost("inquiries/{id}/reply")]
        public async Task<IActionResult> ReplyInquiry(
            Guid id,
            [FromBody] ReplyInquiryRequest request
        )
        {
            var salesUserId = GetUserId();
            if (salesUserId == null)
            {
                return Unauthorized(
                    new ApiResponse<string> { Success = false, Message = "User not found" }
                );
            }

            if (request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(
                    new ApiResponse<string> { Success = false, Message = "Message is required" }
                );
            }

            var inquiry = await _unitOfWork.Inquiries.GetWithMessagesAsync(id);
            if (
                inquiry == null
                || inquiry.Order == null
                || inquiry.Order.AssignedToSalesId != salesUserId
            )
            {
                return NotFound(
                    new ApiResponse<string> { Success = false, Message = "Inquiry not found" }
                );
            }

            inquiry.Status = "WaitingCustomer"; // sales replied, waiting for customer
            await _unitOfWork.InquiryMessages.AddAsync(
                new InquiryMessage
                {
                    Id = Guid.NewGuid(),
                    InquiryId = inquiry.Id,
                    SenderUserId = salesUserId.Value,
                    Content = request.Message,
                    CreatedAt = DateTime.UtcNow,
                    SenderRole = "Sales",
                }
            );

            _unitOfWork.Inquiries.Update(inquiry);
            await _unitOfWork.SaveChangesAsync();

            var reloaded = await _unitOfWork.Inquiries.GetWithMessagesAsync(id);
            return Ok(
                new ApiResponse<InquiryDto> { Success = true, Data = MapInquiryToDto(reloaded!) }
            );
        }

        private OrderDto MapOrderToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserName = order.User?.UserName,
                AssignedToSalesId = order.AssignedToSalesId,
                AssignedSalesName = order.AssignedSales?.FullName ?? order.AssignedSales?.UserName,
                CreatedAt = order.CreatedAt,
                Status = order.Status,
                FulfillmentStatus = order.FulfillmentStatus,
                TotalAmount = order.TotalAmount,
                Currency = order.Currency,
                Items = order
                    .Items.Select(i => new OrderItemDto
                    {
                        Id = i.Id,
                        GameAccountId = i.GameAccountId,
                        GameAccountName = i.GameAccount?.AccountName ?? "Tài khoản game",
                        Price = i.Price,
                        Quantity = i.Quantity,
                    })
                    .ToList(),
                Events =
                    order
                        .FulfillmentEvents?.OrderByDescending(e => e.CreatedAt)
                        .Select(e => new FulfillmentEventDto
                        {
                            Id = e.Id,
                            Status = e.Status,
                            Note = e.Note,
                            CreatedByUserId = e.CreatedByUserId,
                            CreatedByName = e.CreatedBy?.FullName ?? e.CreatedBy?.UserName,
                            CreatedAt = e.CreatedAt,
                        })
                        .ToList() ?? new List<FulfillmentEventDto>(),
            };
        }

        private InquiryDto MapInquiryToDto(Inquiry inquiry)
        {
            return new InquiryDto
            {
                Id = inquiry.Id,
                OrderId = inquiry.OrderId,
                Subject = inquiry.Subject,
                Status = inquiry.Status,
                CreatedAt = inquiry.CreatedAt,
                Messages = inquiry
                    .Messages.OrderByDescending(m => m.CreatedAt)
                    .Select(m => new InquiryMessageDto
                    {
                        Id = m.Id,
                        SenderUserId = m.SenderUserId,
                        SenderName = m.Sender?.FullName ?? m.Sender?.UserName,
                        SenderRole = m.SenderRole,
                        Content = m.Content,
                        CreatedAt = m.CreatedAt,
                    })
                    .ToList(),
            };
        }

        private static bool IsAllowedTransition(string currentStatus, string targetStatus)
        {
            currentStatus = currentStatus ?? string.Empty;
            targetStatus = targetStatus ?? string.Empty;

            if (currentStatus.Equals(targetStatus, StringComparison.OrdinalIgnoreCase))
                return true;

            return currentStatus.ToLower() switch
            {
                "pending" => targetStatus.Equals("Processing", StringComparison.OrdinalIgnoreCase)
                    || targetStatus.Equals("Failed", StringComparison.OrdinalIgnoreCase),
                "paid" => targetStatus.Equals("Processing", StringComparison.OrdinalIgnoreCase)
                    || targetStatus.Equals("Delivered", StringComparison.OrdinalIgnoreCase)
                    || targetStatus.Equals("Failed", StringComparison.OrdinalIgnoreCase),
                "processing" => targetStatus.Equals("Delivered", StringComparison.OrdinalIgnoreCase)
                    || targetStatus.Equals("Failed", StringComparison.OrdinalIgnoreCase),
                _ => false,
            };
        }

        private Guid? GetUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userIdString, out var id) ? id : null;
        }
    }

    public class FulfillmentNoteRequest
    {
        public string Note { get; set; } = string.Empty;
    }
}
