using System;
using System.Collections.Generic;
using System.Linq;
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
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMappingService _mappingService;

        public CategoriesController(IUnitOfWork unitOfWork, IMappingService mappingService)
        {
            _unitOfWork = unitOfWork;
            _mappingService = mappingService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isActive = null
        )
        {
            var result = await _unitOfWork.Categories.GetPagedAsync(
                page,
                pageSize,
                predicate: isActive.HasValue ? c => c.IsActive == isActive.Value : null,
                orderBy: c => c.Name
            );

            var categoriesDto = _mappingService.ToDto(result.Items);

            return Ok(
                new
                {
                    Items = categoriesDto,
                    TotalCount = result.TotalCount,
                    PageNumber = page,
                    PageSize = pageSize,
                }
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(Guid id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);

            if (category == null)
            {
                return NotFound($"Category with ID {id} not found");
            }

            var categoryDto = _mappingService.ToDto(category);

            return Ok(categoryDto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Check if category name already exists
                var existingCategory = await _unitOfWork.Categories.GetFirstOrDefaultAsync(c =>
                    c.Name.ToLower() == request.Name.ToLower()
                );

                if (existingCategory != null)
                {
                    return BadRequest("Category with this name already exists");
                }

                var category = _mappingService.ToEntity(request);

                await _unitOfWork.Categories.AddAsync(category);
                await _unitOfWork.CommitTransactionAsync();

                var categoryDto = _mappingService.ToDto(category);

                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, categoryDto);
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(Guid id, UpdateCategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound($"Category with ID {id} not found");
                }

                // Check if new name conflicts with existing category
                if (category.Name.ToLower() != request.Name.ToLower())
                {
                    var existingCategory = await _unitOfWork.Categories.GetFirstOrDefaultAsync(c =>
                        c.Name.ToLower() == request.Name.ToLower() && c.Id != id
                    );

                    if (existingCategory != null)
                    {
                        return BadRequest("Category with this name already exists");
                    }
                }

                _mappingService.UpdateEntity(category, request);

                _unitOfWork.Categories.Update(category);
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound($"Category with ID {id} not found");
                }

                // Check if category is being used by any game accounts
                var gameAccountsCount = await _unitOfWork.GameAccounts.CountAsync(ga =>
                    ga.CategoryId == id
                );
                if (gameAccountsCount > 0)
                {
                    return BadRequest("Cannot delete category that is being used by game accounts");
                }

                _unitOfWork.Categories.Delete(category);
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetActiveCategories()
        {
            var categories = await _unitOfWork.Categories.GetWhereAsync(c => c.IsActive);

            var categoriesDto = _mappingService.ToDto(categories);

            return Ok(categoriesDto);
        }

        [HttpPatch("{id}/toggle-status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleCategoryStatus(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var category = await _unitOfWork.Categories.GetByIdAsync(id);
                if (category == null)
                {
                    return NotFound($"Category with ID {id} not found");
                }

                category.IsActive = !category.IsActive;
                _unitOfWork.Categories.Update(category);
                await _unitOfWork.CommitTransactionAsync();

                return Ok(new { IsActive = category.IsActive });
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
