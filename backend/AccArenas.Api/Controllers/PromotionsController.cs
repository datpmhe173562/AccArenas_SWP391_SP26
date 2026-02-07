using System.ComponentModel.DataAnnotations;
using System.Net;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Exceptions;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PromotionsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILogger<PromotionsController> _logger;

        public PromotionsController(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILogger<PromotionsController> logger
        )
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _logger = logger;
        }

        /// <summary>
        /// Lấy danh sách tất cả khuyến mãi với phân trang
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<object>> GetPromotions(
            [FromQuery] PromotionQueryRequest query
        )
        {
            try
            {
                // Xây dựng điều kiện lọc
                var predicate = BuildFilterPredicate(query);

                // Lấy dữ liệu với phân trang
                var (promotions, totalCount) = await _unitOfWork.Promotions.GetPagedAsync(
                    query.Page,
                    query.PageSize,
                    predicate,
                    p => p.CreatedAt,
                    orderByDescending: true
                );

                var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(promotions);

                return Ok(
                    new
                    {
                        data = promotionDtos,
                        pagination = new
                        {
                            page = query.Page,
                            pageSize = query.PageSize,
                            totalCount = totalCount,
                            totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize),
                        },
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách khuyến mãi");
                return StatusCode(500, new { message = "Lỗi server khi lấy danh sách khuyến mãi" });
            }
        }

        /// <summary>
        /// Lấy khuyến mãi theo ID
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PromotionDto>> GetPromotion(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);

                if (promotion == null)
                {
                    throw new ApiException("Không tìm thấy khuyến mãi", HttpStatusCode.NotFound);
                }

                var promotionDto = _mapper.Map<PromotionDto>(promotion);
                return Ok(promotionDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin khuyến mãi {PromotionId}", id);
                return StatusCode(500, new { message = "Lỗi server khi lấy thông tin khuyến mãi" });
            }
        }

        /// <summary>
        /// Lấy khuyến mãi theo mã code
        /// </summary>
        [HttpGet("by-code/{code}")]
        public async Task<ActionResult<PromotionDto>> GetPromotionByCode(string code)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByCodeAsync(code);

                if (promotion == null)
                {
                    throw new ApiException("Không tìm thấy khuyến mãi với mã này", HttpStatusCode.NotFound);
                }

                var promotionDto = _mapper.Map<PromotionDto>(promotion);
                return Ok(promotionDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin khuyến mãi theo mã {Code}", code);
                return StatusCode(500, new { message = "Lỗi server khi lấy thông tin khuyến mãi" });
            }
        }

        /// <summary>
        /// Lấy danh sách khuyến mãi đang hoạt động
        /// </summary>
        [HttpGet("active")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetActivePromotions()
        {
            try
            {
                var activePromotions = await _unitOfWork.Promotions.GetActivePromotionsAsync();
                var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(activePromotions);

                return Ok(promotionDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách khuyến mãi hoạt động");
                return StatusCode(500, new { message = "Lỗi server khi lấy danh sách khuyến mãi" });
            }
        }

        /// <summary>
        /// Lấy danh sách khuyến mãi có hiệu lực tại thời điểm hiện tại
        /// </summary>
        [HttpGet("valid")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PromotionDto>>> GetValidPromotions()
        {
            try
            {
                var validPromotions = await _unitOfWork.Promotions.GetPromotionsByValidDateAsync(
                    DateTime.UtcNow
                );
                var promotionDtos = _mapper.Map<IEnumerable<PromotionDto>>(validPromotions);

                return Ok(promotionDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách khuyến mãi có hiệu lực");
                return StatusCode(500, new { message = "Lỗi server khi lấy danh sách khuyến mãi" });
            }
        }

        /// <summary>
        /// Tạo khuyến mãi mới
        /// </summary>
        [HttpPost]
       [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<PromotionDto>> CreatePromotion(
            CreatePromotionRequest request
        )
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                // Kiểm tra trùng mã code
                var existingPromotion = await _unitOfWork.Promotions.GetByCodeAsync(request.Code);
                if (existingPromotion != null)
                {
                    throw new ApiException("Mã khuyến mãi đã tồn tại", HttpStatusCode.BadRequest);
                }

                // Validate dates
                if (request.StartDate >= request.EndDate)
                {
                    throw new ApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc", HttpStatusCode.BadRequest);
                }

                if (request.EndDate <= DateTime.UtcNow)
                {
                    throw new ApiException("Ngày kết thúc phải lớn hơn thời điểm hiện tại", HttpStatusCode.BadRequest);
                }

                var promotion = _mapper.Map<Promotion>(request);
                promotion.Id = Guid.NewGuid();

                await _unitOfWork.Promotions.AddAsync(promotion);
                await _unitOfWork.SaveChangesAsync();

                var promotionDto = _mapper.Map<PromotionDto>(promotion);

                _logger.LogInformation(
                    "Đã tạo khuyến mãi mới {PromotionId} với mã {Code}",
                    promotion.Id,
                    promotion.Code
                );

                return CreatedAtAction(
                    nameof(GetPromotion),
                    new { id = promotion.Id },
                    promotionDto
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo khuyến mãi mới");
                return StatusCode(500, new { message = "Lỗi server khi tạo khuyến mãi" });
            }
        }

        /// <summary>
        /// Cập nhật khuyến mãi
        /// </summary>
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<PromotionDto>> UpdatePromotion(
            Guid id,
            UpdatePromotionRequest request
        )
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                var existingPromotion = await _unitOfWork.Promotions.GetByIdAsync(id);
                if (existingPromotion == null)
                {
                    throw new ApiException("Không tìm thấy khuyến mãi", HttpStatusCode.NotFound);
                }

                // Kiểm tra trùng mã code (trừ chính nó)
                var promotionWithSameCode = await _unitOfWork.Promotions.GetByCodeAsync(
                    request.Code
                );
                if (promotionWithSameCode != null && promotionWithSameCode.Id != id)
                {
                    throw new ApiException("Mã khuyến mãi đã tồn tại", HttpStatusCode.BadRequest);
                }

                // Validate dates
                if (request.StartDate >= request.EndDate)
                {
                    throw new ApiException("Ngày bắt đầu phải nhỏ hơn ngày kết thúc", HttpStatusCode.BadRequest);
                }

                // Map updates
                _mapper.Map(request, existingPromotion);

                _unitOfWork.Promotions.Update(existingPromotion);
                await _unitOfWork.SaveChangesAsync();

                var promotionDto = _mapper.Map<PromotionDto>(existingPromotion);

                _logger.LogInformation("Đã cập nhật khuyến mãi {PromotionId}", id);

                return Ok(promotionDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật khuyến mãi {PromotionId}", id);
                return StatusCode(500, new { message = "Lỗi server khi cập nhật khuyến mãi" });
            }
        }

        /// <summary>
        /// Xóa khuyến mãi
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> DeletePromotion(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
                if (promotion == null)
                {
                    throw new ApiException("Không tìm thấy khuyến mãi", HttpStatusCode.NotFound);
                }

                _unitOfWork.Promotions.Delete(promotion);
                await _unitOfWork.SaveChangesAsync();

                _logger.LogInformation("Đã xóa khuyến mãi {PromotionId}", id);

                return Ok(new { message = "Xóa khuyến mãi thành công" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa khuyến mãi {PromotionId}", id);
                return StatusCode(500, new { message = "Lỗi server khi xóa khuyến mãi" });
            }
        }

        /// <summary>
        /// Bật/tắt khuyến mãi
        /// </summary>
        [HttpPatch("{id:guid}/toggle-status")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<PromotionDto>> TogglePromotionStatus(Guid id)
        {
            try
            {
                var promotion = await _unitOfWork.Promotions.GetByIdAsync(id);
                if (promotion == null)
                {
                    throw new ApiException("Không tìm thấy khuyến mãi", HttpStatusCode.NotFound);
                }

                promotion.IsActive = !promotion.IsActive;
                _unitOfWork.Promotions.Update(promotion);
                await _unitOfWork.SaveChangesAsync();

                var promotionDto = _mapper.Map<PromotionDto>(promotion);

                _logger.LogInformation(
                    "Đã thay đổi trạng thái khuyến mãi {PromotionId} thành {Status}",
                    id,
                    promotion.IsActive ? "hoạt động" : "không hoạt động"
                );

                return Ok(promotionDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thay đổi trạng thái khuyến mãi {PromotionId}", id);
                return StatusCode(
                    500,
                    new { message = "Lỗi server khi thay đổi trạng thái khuyến mãi" }
                );
            }
        }

        /// <summary>
        /// Validate mã khuyến mãi
        /// </summary>
        [HttpPost("validate")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> ValidatePromotionCode([FromBody] string code)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code))
                {
                    throw new ApiException("Mã khuyến mãi không được để trống", HttpStatusCode.BadRequest);
                }

                var promotion = await _unitOfWork.Promotions.GetByCodeAsync(code);

                if (promotion == null)
                {
                    return Ok(new { isValid = false, message = "Mã khuyến mãi không tồn tại" });
                }

                if (!promotion.IsActive)
                {
                    return Ok(new { isValid = false, message = "Mã khuyến mãi đã bị vô hiệu hóa" });
                }

                var now = DateTime.UtcNow;
                if (now < promotion.StartDate)
                {
                    return Ok(new { isValid = false, message = "Mã khuyến mãi chưa có hiệu lực" });
                }

                if (now > promotion.EndDate)
                {
                    return Ok(new { isValid = false, message = "Mã khuyến mãi đã hết hạn" });
                }

                var promotionDto = _mapper.Map<PromotionDto>(promotion);
                return Ok(
                    new
                    {
                        isValid = true,
                        message = "Mã khuyến mãi hợp lệ",
                        promotion = promotionDto,
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi validate mã khuyến mãi {Code}", code);
                return StatusCode(500, new { message = "Lỗi server khi kiểm tra mã khuyến mãi" });
            }
        }

        private System.Linq.Expressions.Expression<Func<Promotion, bool>> BuildFilterPredicate(
            PromotionQueryRequest query
        )
        {
            var predicate = System.Linq.Expressions.Expression.Parameter(typeof(Promotion), "p");
            System.Linq.Expressions.Expression? combinedExpression = null;

            // Filter by code
            if (!string.IsNullOrWhiteSpace(query.Code))
            {
                var codeProperty = System.Linq.Expressions.Expression.Property(
                    predicate,
                    nameof(Promotion.Code)
                );
                var codeValue = System.Linq.Expressions.Expression.Constant(query.Code.ToLower());
                var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes);
                var toLowerCall = System.Linq.Expressions.Expression.Call(
                    codeProperty,
                    toLowerMethod!
                );
                var containsMethod = typeof(string).GetMethod("Contains", new[] { typeof(string) });
                var codeContains = System.Linq.Expressions.Expression.Call(
                    toLowerCall,
                    containsMethod!,
                    codeValue
                );

                combinedExpression = codeContains;
            }

            // Filter by IsActive
            if (query.IsActive.HasValue)
            {
                var isActiveProperty = System.Linq.Expressions.Expression.Property(
                    predicate,
                    nameof(Promotion.IsActive)
                );
                var isActiveValue = System.Linq.Expressions.Expression.Constant(
                    query.IsActive.Value
                );
                var isActiveEqual = System.Linq.Expressions.Expression.Equal(
                    isActiveProperty,
                    isActiveValue
                );

                combinedExpression =
                    combinedExpression == null
                        ? isActiveEqual
                        : System.Linq.Expressions.Expression.AndAlso(
                            combinedExpression,
                            isActiveEqual
                        );
            }

            // Filter by date range
            if (query.StartDate.HasValue)
            {
                var startDateProperty = System.Linq.Expressions.Expression.Property(
                    predicate,
                    nameof(Promotion.StartDate)
                );
                var startDateValue = System.Linq.Expressions.Expression.Constant(
                    query.StartDate.Value
                );
                var startDateGreaterEqual = System.Linq.Expressions.Expression.GreaterThanOrEqual(
                    startDateProperty,
                    startDateValue
                );

                combinedExpression =
                    combinedExpression == null
                        ? startDateGreaterEqual
                        : System.Linq.Expressions.Expression.AndAlso(
                            combinedExpression,
                            startDateGreaterEqual
                        );
            }

            if (query.EndDate.HasValue)
            {
                var endDateProperty = System.Linq.Expressions.Expression.Property(
                    predicate,
                    nameof(Promotion.EndDate)
                );
                var endDateValue = System.Linq.Expressions.Expression.Constant(query.EndDate.Value);
                var endDateLessEqual = System.Linq.Expressions.Expression.LessThanOrEqual(
                    endDateProperty,
                    endDateValue
                );

                combinedExpression =
                    combinedExpression == null
                        ? endDateLessEqual
                        : System.Linq.Expressions.Expression.AndAlso(
                            combinedExpression,
                            endDateLessEqual
                        );
            }

            // If no filters, return all
            if (combinedExpression == null)
            {
                combinedExpression = System.Linq.Expressions.Expression.Constant(true);
            }

            return System.Linq.Expressions.Expression.Lambda<Func<Promotion, bool>>(
                combinedExpression,
                predicate
            );
        }
    }
}
