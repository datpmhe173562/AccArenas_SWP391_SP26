using System;
using System.Net;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Exceptions;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BannersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMappingService _mappingService;

        public BannersController(IUnitOfWork unitOfWork, IMappingService mappingService)
        {
            _unitOfWork = unitOfWork;
            _mappingService = mappingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBanners(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isActive = null
        )
        {
            var result = await _unitOfWork.Banners.GetPagedAsync(
                page,
                pageSize,
                predicate: b => !isActive.HasValue || b.IsActive == isActive.Value,
                orderBy: b => b.Order
            );

            var bannersDto = _mappingService.ToDto(result.Items);

            return Ok(new
            {
                Items = bannersDto,
                TotalCount = result.TotalCount,
                PageNumber = page,
                PageSize = pageSize,
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BannerDto>> GetBanner(Guid id)
        {
            var banner = await _unitOfWork.Banners.GetByIdAsync(id);

            if (banner == null)
            {
                throw new ApiException($"Banner with ID {id} not found", HttpStatusCode.NotFound);
            }

            return Ok(_mappingService.ToDto(banner));
        }

        [HttpPost]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<BannerDto>> CreateBanner(CreateBannerRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var banner = _mappingService.ToEntity(request);
                await _unitOfWork.Banners.AddAsync(banner);
                await _unitOfWork.CommitTransactionAsync();

                return CreatedAtAction(nameof(GetBanner), new { id = banner.Id }, _mappingService.ToDto(banner));
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> UpdateBanner(Guid id, UpdateBannerRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var banner = await _unitOfWork.Banners.GetByIdAsync(id);
                if (banner == null)
                {
                    throw new ApiException($"Banner with ID {id} not found", HttpStatusCode.NotFound);
                }

                _mappingService.UpdateEntity(banner, request);
                _unitOfWork.Banners.Update(banner);
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> DeleteBanner(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var banner = await _unitOfWork.Banners.GetByIdAsync(id);
                if (banner == null)
                {
                    throw new ApiException($"Banner with ID {id} not found", HttpStatusCode.NotFound);
                }

                _unitOfWork.Banners.Delete(banner);
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPatch("{id}/toggle-status")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> ToggleBannerStatus(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var banner = await _unitOfWork.Banners.GetByIdAsync(id);
                if (banner == null)
                {
                    throw new ApiException($"Banner with ID {id} not found", HttpStatusCode.NotFound);
                }

                banner.IsActive = !banner.IsActive;
                _unitOfWork.Banners.Update(banner);
                await _unitOfWork.CommitTransactionAsync();

                return Ok(new { IsActive = banner.IsActive });
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveBanners()
        {
            var banners = await _unitOfWork.Banners.GetActiveBannersOrderedAsync();
            return Ok(_mappingService.ToDto(banners));
        }
    }
}
