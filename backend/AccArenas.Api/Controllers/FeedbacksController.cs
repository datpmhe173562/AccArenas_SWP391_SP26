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
    [Route("api/[controller]")]
    public class FeedbacksController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public FeedbacksController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("order/{orderId}")]
        [Authorize]
        public async Task<IActionResult> GetByOrder(Guid orderId)
        {
            var feedbacks = await _unitOfWork.Feedbacks.GetByOrderAsync(orderId);
            return Ok(new ApiResponse<IEnumerable<Feedback>> { Success = true, Data = feedbacks });
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateFeedbackRequest request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var feedback = new Feedback
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                OrderId = request.OrderId,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Feedbacks.AddAsync(feedback);
            await _unitOfWork.SaveChangesAsync();

            return Ok(new ApiResponse<Feedback> { Success = true, Data = feedback, Message = "Gửi phản hồi thành công!" });
        }
    }

    public class CreateFeedbackRequest
    {
        public Guid OrderId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
