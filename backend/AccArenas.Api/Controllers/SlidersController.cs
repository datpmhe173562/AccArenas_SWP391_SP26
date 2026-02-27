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
    public class SlidersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMappingService _mappingService;

        public SlidersController(IUnitOfWork unitOfWork, IMappingService mappingService)
        {
            _unitOfWork = unitOfWork;
            _mappingService = mappingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSliders(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isActive = null
        )
        {
            var result = await _unitOfWork.Sliders.GetPagedAsync(
                page,
                pageSize,
                predicate: s => !isActive.HasValue || s.IsActive == isActive.Value,
                orderBy: s => s.Order
            );

            var slidersDto = _mappingService.ToDto(result.Items);

            return Ok(new
            {
                Items = slidersDto,
                TotalCount = result.TotalCount,
                PageNumber = page,
                PageSize = pageSize,
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SliderDto>> GetSlider(Guid id)
        {
            var slider = await _unitOfWork.Sliders.GetByIdAsync(id);

            if (slider == null)
            {
                throw new ApiException($"Slider with ID {id} not found", HttpStatusCode.NotFound);
            }

            return Ok(_mappingService.ToDto(slider));
        }

        [HttpPost]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<SliderDto>> CreateSlider(CreateSliderRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var slider = _mappingService.ToEntity(request);
                await _unitOfWork.Sliders.AddAsync(slider);
                await _unitOfWork.CommitTransactionAsync();

                return CreatedAtAction(nameof(GetSlider), new { id = slider.Id }, _mappingService.ToDto(slider));
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> UpdateSlider(Guid id, UpdateSliderRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var slider = await _unitOfWork.Sliders.GetByIdAsync(id);
                if (slider == null)
                {
                    throw new ApiException($"Slider with ID {id} not found", HttpStatusCode.NotFound);
                }

                _mappingService.UpdateEntity(slider, request);
                _unitOfWork.Sliders.Update(slider);
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
        public async Task<IActionResult> DeleteSlider(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var slider = await _unitOfWork.Sliders.GetByIdAsync(id);
                if (slider == null)
                {
                    throw new ApiException($"Slider with ID {id} not found", HttpStatusCode.NotFound);
                }

                _unitOfWork.Sliders.Delete(slider);
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
        public async Task<IActionResult> ToggleSliderStatus(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var slider = await _unitOfWork.Sliders.GetByIdAsync(id);
                if (slider == null)
                {
                    throw new ApiException($"Slider with ID {id} not found", HttpStatusCode.NotFound);
                }

                slider.IsActive = !slider.IsActive;
                _unitOfWork.Sliders.Update(slider);
                await _unitOfWork.CommitTransactionAsync();

                return Ok(new { IsActive = slider.IsActive });
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveSliders()
        {
            var sliders = await _unitOfWork.Sliders.GetActiveSlidersOrderedAsync();
            return Ok(_mappingService.ToDto(sliders));
        }
    }
}
