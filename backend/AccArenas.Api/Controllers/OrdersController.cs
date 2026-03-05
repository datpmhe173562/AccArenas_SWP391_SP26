using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IVnPayService _vnPayService;
        private readonly IConfiguration _configuration;

        public OrdersController(IUnitOfWork unitOfWork, IVnPayService vnPayService, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _vnPayService = vnPayService;
            _configuration = configuration;
        }

        [HttpGet("my-orders")]
        [Authorize]
        public async Task<IActionResult> GetMyOrders()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new ApiResponse<string> { Success = false, Message = "Người dùng không hợp lệ." });
            }

            var orders = await _unitOfWork.Orders.GetOrdersByUserWithItemsAsync(userId);
            var orderDtos = orders.Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                CreatedAt = o.CreatedAt,
                Status = o.Status,
                TotalAmount = o.TotalAmount,
                Currency = o.Currency,
                Items = o.Items.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    GameAccountId = oi.GameAccountId,
                    GameAccountName = oi.GameAccount?.AccountName ?? "Tài khoản game",
                    Price = oi.Price,
                    Quantity = oi.Quantity
                }).ToList()
            });

            return Ok(new ApiResponse<IEnumerable<OrderDto>>
            {
                Success = true,
                Data = orderDtos
            });
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetOrder(Guid id)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new ApiResponse<string> { Success = false, Message = "Người dùng không hợp lệ." });
            }

            var order = await _unitOfWork.Orders.GetOrderByIdWithItemsAsync(id);
            if (order == null || order.UserId != userId)
            {
                return NotFound(new ApiResponse<string> { Success = false, Message = "Đơn hàng không tồn tại." });
            }

            var orderDto = new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                CreatedAt = order.CreatedAt,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                Currency = order.Currency,
                Items = order.Items.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    GameAccountId = oi.GameAccountId,
                    GameAccountName = oi.GameAccount?.AccountName ?? "Tài khoản game",
                    Price = oi.Price,
                    Quantity = oi.Quantity
                }).ToList()
            };

            return Ok(new ApiResponse<OrderDto>
            {
                Success = true,
                Data = orderDto
            });
        }

        [HttpPost("create-payment")]
        [Authorize]
        public async Task<IActionResult> CreatePayment([FromBody] CreateOrderRequest request)
        {
            if (request.GameAccountIds == null || !request.GameAccountIds.Any())
            {
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Dữ liệu không hợp lệ." });
            }

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized(new ApiResponse<string> { Success = false, Message = "Người dùng không hợp lệ." });
            }

            // 1. Validate Game Accounts
            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();
            var gameAccounts = new List<GameAccount>();

            foreach (var accountId in request.GameAccountIds)
            {
                var gameAccount = await _unitOfWork.GameAccounts.GetByIdAsync(accountId);
                if (gameAccount == null || !gameAccount.IsAvailable)
                {
                    return BadRequest(new ApiResponse<string> { Success = false, Message = $"Tài khoản {accountId} không tồn tại hoặc đã được mua." });
                }

                totalAmount += gameAccount.Price;
                gameAccounts.Add(gameAccount);
                orderItems.Add(new OrderItem
                {
                    Id = Guid.NewGuid(),
                    GameAccountId = accountId,
                    Price = gameAccount.Price,
                    Quantity = 1
                });
            }

            // 2. Create Order
            var order = new Order
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = totalAmount,
                Currency = "VND",
                Items = orderItems
            };

            await _unitOfWork.Orders.AddAsync(order);

            // 3. Mark Game Accounts as Pending or Unavailale (Locking them) 
            foreach (var acc in gameAccounts)
            {
                acc.IsAvailable = false;
                _unitOfWork.GameAccounts.Update(acc);
            }

            await _unitOfWork.SaveChangesAsync();

            // 4. Generate VNPay URL
            var paymentReq = new PaymentInformationRequest
            {
                Amount = (double)totalAmount,
                OrderId = order.Id.ToString(),
                OrderDescription = "Thanh toán giao dịch AccArenas",
                Name = "AccArenas Customer",
                OrderType = "vnpay"
            };

            var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, paymentReq);

            return Ok(new ApiResponse<string>
            {
                Success = true,
                Message = "Tạo đơn hàng thành công.",
                Data = paymentUrl
            });
        }
    }
}
