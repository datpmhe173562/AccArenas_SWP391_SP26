using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
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
    public class GameAccountsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GameAccountsController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<GameAccountDto>>> GetGameAccounts(
            [FromQuery] string? query = null,
            [FromQuery] Guid? categoryId = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] bool? isAvailable = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10
        )
        {
            var (accounts, totalCount) = await _unitOfWork.GameAccounts.GetPagedAsync(
                pageNumber,
                pageSize,
                g => (string.IsNullOrEmpty(query) || g.Game.Contains(query) || g.AccountName.Contains(query)) &&
                     (!categoryId.HasValue || g.CategoryId == categoryId.Value) &&
                     (!minPrice.HasValue || g.Price >= minPrice.Value) &&
                     (!maxPrice.HasValue || g.Price <= maxPrice.Value) &&
                     (!isAvailable.HasValue || g.IsAvailable == isAvailable.Value),
                g => g.CreatedAt,
                true
            );

            var dtos = _mapper.Map<IEnumerable<GameAccountDto>>(accounts);
            
            return Ok(new PagedResult<GameAccountDto>
            {
                Items = dtos,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GameAccountDto>> GetGameAccount(Guid id)
        {
            var account = await _unitOfWork.GameAccounts.GetByIdAsync(id);

            if (account == null)
            {
                throw new ApiException($"Game account with ID {id} not found", HttpStatusCode.NotFound);
            }

            var dto = _mapper.Map<GameAccountDto>(account);
            return Ok(dto);
        }

        [HttpGet("game/{gameName}")]
        public async Task<ActionResult<IEnumerable<GameAccountDto>>> GetAccountsByGame(string gameName)
        {
            var accounts = await _unitOfWork.GameAccounts.GetAccountsByGameAsync(gameName);
            var dtos = _mapper.Map<IEnumerable<GameAccountDto>>(accounts);
            return Ok(dtos);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<GameAccountDto>>> GetAccountsByCategory(
            Guid categoryId
        )
        {
            var accounts = await _unitOfWork.GameAccounts.GetAccountsByCategoryAsync(categoryId);
            var dtos = _mapper.Map<IEnumerable<GameAccountDto>>(accounts);
            return Ok(dtos);
        }

        [HttpGet("price-range")]
        public async Task<ActionResult<IEnumerable<GameAccountDto>>> GetAccountsByPriceRange(
            [FromQuery] decimal minPrice,
            [FromQuery] decimal maxPrice
        )
        {
            var accounts = await _unitOfWork.GameAccounts.GetAccountsByPriceRangeAsync(
                minPrice,
                maxPrice
            );
            var dtos = _mapper.Map<IEnumerable<GameAccountDto>>(accounts);
            return Ok(dtos);
        }

        [HttpPost]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<ActionResult<GameAccountDto>> CreateGameAccount([FromBody] CreateGameAccountRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Invalid model state", HttpStatusCode.BadRequest);
            }

            try
            {
                // Begin transaction
                await _unitOfWork.BeginTransactionAsync();

                // Check if category exists
                var categoryExists = await _unitOfWork.Categories.ExistsAsync(c =>
                    c.Id == request.CategoryId
                );
                if (!categoryExists)
                {
                    throw new ApiException("Category does not exist", HttpStatusCode.BadRequest);
                }

                // Check if account name already exists
                var existingAccount = await _unitOfWork.GameAccounts.GetByAccountNameAsync(
                    request.AccountName
                );
                if (existingAccount != null)
                {
                    throw new ApiException("Account name already exists", HttpStatusCode.BadRequest);
                }

                var gameAccount = _mapper.Map<GameAccount>(request);
                gameAccount.Id = Guid.NewGuid();
                gameAccount.CreatedAt = DateTime.UtcNow;

                await _unitOfWork.GameAccounts.AddAsync(gameAccount);

                // Commit transaction
                await _unitOfWork.CommitTransactionAsync();

                var dto = _mapper.Map<GameAccountDto>(gameAccount);
                return CreatedAtAction(
                    nameof(GetGameAccount),
                    new { id = gameAccount.Id },
                    dto
                );
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "MarketingStaff")]
        public async Task<IActionResult> UpdateGameAccount(Guid id, [FromBody] UpdateGameAccountRequest request)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var existingAccount = await _unitOfWork.GameAccounts.GetByIdAsync(id);
                if (existingAccount == null)
                {
                    throw new ApiException($"Game account with ID {id} not found", HttpStatusCode.NotFound);
                }

                // Map updates
                _mapper.Map(request, existingAccount);

                _unitOfWork.GameAccounts.Update(existingAccount);
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
        public async Task<IActionResult> DeleteGameAccount(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var account = await _unitOfWork.GameAccounts.GetByIdAsync(id);
                if (account == null)
                {
                    throw new ApiException($"Game account with ID {id} not found", HttpStatusCode.NotFound);
                }

                _unitOfWork.GameAccounts.Delete(account);
                await _unitOfWork.CommitTransactionAsync();

                return NoContent();
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}
