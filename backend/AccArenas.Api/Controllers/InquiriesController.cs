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
    [Route("api/inquiries")]
    [Authorize]
    public class InquiriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public InquiriesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyInquiries()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var inquiries = await _unitOfWork.Inquiries.GetByCustomerAsync(userId.Value);
            var dto = inquiries.Select(MapInquiryToDto);
            return Ok(new ApiResponse<IEnumerable<InquiryDto>> { Success = true, Data = dto });
        }

        [HttpGet("order/{orderId}")]
        public async Task<IActionResult> GetByOrder(Guid orderId)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
            if (order == null || order.UserId != userId)
            {
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Đơn hàng không hợp lệ." });
            }

            var inquiries = await _unitOfWork.Inquiries.GetByOrderAsync(orderId);
            var dto = inquiries.Select(MapInquiryToDto);
            return Ok(new ApiResponse<IEnumerable<InquiryDto>> { Success = true, Data = dto });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInquiry(Guid id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var inquiry = await _unitOfWork.Inquiries.GetWithMessagesAsync(id);
            if (inquiry == null || inquiry.CustomerUserId != userId)
            {
                return NotFound(new ApiResponse<string> { Success = false, Message = "Yêu cầu không tồn tại." });
            }

            return Ok(new ApiResponse<InquiryDto> { Success = true, Data = MapInquiryToDto(inquiry) });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateInquiryRequest request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            if (request == null || string.IsNullOrWhiteSpace(request.Subject) || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Tiêu đề và nội dung là bắt buộc." });
            }

            var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId);
            if (order == null || order.UserId != userId)
            {
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Đơn hàng không hợp lệ." });
            }

            var inquiry = new Inquiry
            {
                Id = Guid.NewGuid(),
                OrderId = request.OrderId,
                CustomerUserId = userId.Value,
                Subject = request.Subject,
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            };

            var message = new InquiryMessage
            {
                Id = Guid.NewGuid(),
                InquiryId = inquiry.Id,
                SenderUserId = userId.Value,
                Content = request.Message,
                CreatedAt = DateTime.UtcNow,
                SenderRole = "Customer"
            };

            inquiry.Messages.Add(message);

            await _unitOfWork.Inquiries.AddAsync(inquiry);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new ApiResponse<InquiryDto> { Success = true, Data = MapInquiryToDto(inquiry), Message = "Gửi yêu cầu thành công." });
        }

        [HttpPost("{id}/reply")]
        public async Task<IActionResult> Reply(Guid id, [FromBody] ReplyInquiryRequest request)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            if (request == null || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new ApiResponse<string> { Success = false, Message = "Nội dung phản hồi không được để trống." });
            }

            var inquiry = await _unitOfWork.Inquiries.GetWithMessagesAsync(id);
            if (inquiry == null || inquiry.CustomerUserId != userId)
            {
                return NotFound(new ApiResponse<string> { Success = false, Message = "Yêu cầu không tồn tại." });
            }

            inquiry.Status = "Open"; // reopen if closed or waiting
            var message = new InquiryMessage
            {
                Id = Guid.NewGuid(),
                InquiryId = inquiry.Id,
                SenderUserId = userId.Value,
                Content = request.Message,
                CreatedAt = DateTime.UtcNow,
                SenderRole = "Customer"
            };

            await _unitOfWork.InquiryMessages.AddAsync(message);
            _unitOfWork.Inquiries.Update(inquiry);
            await _unitOfWork.SaveChangesAsync();

            var reloaded = await _unitOfWork.Inquiries.GetWithMessagesAsync(id);
            return Ok(new ApiResponse<InquiryDto> { Success = true, Data = MapInquiryToDto(reloaded!) });
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
                Messages = inquiry.Messages?.OrderBy(m => m.CreatedAt).Select(m => new InquiryMessageDto
                {
                    Id = m.Id,
                    SenderUserId = m.SenderUserId,
                    SenderName = m.Sender?.FullName ?? m.Sender?.UserName,
                    SenderRole = m.SenderRole,
                    Content = m.Content,
                    CreatedAt = m.CreatedAt
                }).ToList() ?? new List<InquiryMessageDto>()
            };
        }

        private Guid? GetUserId()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(userIdString, out var id) ? id : null;
        }
    }

    public class CreateInquiryRequest
    {
        public Guid OrderId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}
