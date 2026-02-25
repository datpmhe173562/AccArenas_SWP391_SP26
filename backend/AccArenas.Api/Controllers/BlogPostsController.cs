using System;
using System.Net;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Exceptions;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AccArenas.Api.Infrastructure.Data;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogPostsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMappingService _mappingService;
        private readonly ApplicationDbContext _context;

        public BlogPostsController(IUnitOfWork unitOfWork, IMappingService mappingService, ApplicationDbContext context)
        {
            _unitOfWork = unitOfWork;
            _mappingService = mappingService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetBlogPosts(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? isPublished = null,
            [FromQuery] Guid? categoryId = null
        )
        {
            var query = _context.BlogPosts
                .Include(p => p.Category)
                .AsQueryable();

            if (isPublished.HasValue)
                query = query.Where(p => p.IsPublished == isPublished.Value);

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var postsDto = _mappingService.ToDto(items);

            return Ok(new
            {
                Items = postsDto,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize,
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostDto>> GetBlogPost(Guid id)
        {
            var post = await _context.BlogPosts
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (post == null)
            {
                throw new ApiException($"Blog post with ID {id} not found", HttpStatusCode.NotFound);
            }

            return Ok(_mappingService.ToDto(post));
        }

        [HttpPost]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<BlogPostDto>> CreateBlogPost(CreateBlogPostRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                // Verify category exists
                var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId);
                if (category == null)
                {
                    throw new ApiException($"Danh mục với ID {request.CategoryId} không tồn tại", HttpStatusCode.BadRequest);
                }

                var post = _mappingService.ToEntity(request);
                await _unitOfWork.BlogPosts.AddAsync(post);
                await _unitOfWork.CommitTransactionAsync();

                // Re-fetch with category to populate CategoryName
                var createdPost = await _context.BlogPosts
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(p => p.Id == post.Id);

                return CreatedAtAction(nameof(GetBlogPost), new { id = post.Id }, _mappingService.ToDto(createdPost!));
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> UpdateBlogPost(Guid id, UpdateBlogPostRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Dữ liệu không hợp lệ", HttpStatusCode.BadRequest);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var post = await _unitOfWork.BlogPosts.GetByIdAsync(id);
                if (post == null)
                {
                    throw new ApiException($"Blog post with ID {id} not found", HttpStatusCode.NotFound);
                }

                // Verify category exists
                var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId);
                if (category == null)
                {
                    throw new ApiException($"Danh mục với ID {request.CategoryId} không tồn tại", HttpStatusCode.BadRequest);
                }

                bool wasPublished = post.IsPublished;
                _mappingService.UpdateEntity(post, request);

                if (!wasPublished && post.IsPublished)
                {
                    post.PublishedAt = DateTime.UtcNow;
                }
                else if (!post.IsPublished)
                {
                    post.PublishedAt = null;
                }

                _unitOfWork.BlogPosts.Update(post);
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
        public async Task<IActionResult> DeleteBlogPost(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var post = await _unitOfWork.BlogPosts.GetByIdAsync(id);
                if (post == null)
                {
                    throw new ApiException($"Blog post with ID {id} not found", HttpStatusCode.NotFound);
                }

                _unitOfWork.BlogPosts.Delete(post);
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPatch("{id}/publish")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> TogglePublish(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var post = await _unitOfWork.BlogPosts.GetByIdAsync(id);
                if (post == null)
                {
                    throw new ApiException($"Blog post with ID {id} not found", HttpStatusCode.NotFound);
                }

                post.IsPublished = !post.IsPublished;
                post.PublishedAt = post.IsPublished ? DateTime.UtcNow : null;

                _unitOfWork.BlogPosts.Update(post);
                await _unitOfWork.CommitTransactionAsync();

                return Ok(new { IsPublished = post.IsPublished, PublishedAt = post.PublishedAt });
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
