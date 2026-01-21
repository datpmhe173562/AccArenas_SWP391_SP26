using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameAccountsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public GameAccountsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameAccount>>> GetGameAccounts()
        {
            var accounts = await _unitOfWork.GameAccounts.GetAvailableAccountsAsync();
            return Ok(accounts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GameAccount>> GetGameAccount(Guid id)
        {
            var account = await _unitOfWork.GameAccounts.GetByIdAsync(id);

            if (account == null)
            {
                return NotFound();
            }

            return Ok(account);
        }

        [HttpGet("game/{gameName}")]
        public async Task<ActionResult<IEnumerable<GameAccount>>> GetAccountsByGame(string gameName)
        {
            var accounts = await _unitOfWork.GameAccounts.GetAccountsByGameAsync(gameName);
            return Ok(accounts);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<GameAccount>>> GetAccountsByCategory(
            Guid categoryId
        )
        {
            var accounts = await _unitOfWork.GameAccounts.GetAccountsByCategoryAsync(categoryId);
            return Ok(accounts);
        }

        [HttpGet("price-range")]
        public async Task<ActionResult<IEnumerable<GameAccount>>> GetAccountsByPriceRange(
            [FromQuery] decimal minPrice,
            [FromQuery] decimal maxPrice
        )
        {
            var accounts = await _unitOfWork.GameAccounts.GetAccountsByPriceRangeAsync(
                minPrice,
                maxPrice
            );
            return Ok(accounts);
        }

        [HttpPost]
        public async Task<ActionResult<GameAccount>> CreateGameAccount(GameAccount gameAccount)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Begin transaction
                await _unitOfWork.BeginTransactionAsync();

                // Check if category exists
                var categoryExists = await _unitOfWork.Categories.ExistsAsync(c =>
                    c.Id == gameAccount.CategoryId
                );
                if (!categoryExists)
                {
                    return BadRequest("Category does not exist");
                }

                // Check if account name already exists
                var existingAccount = await _unitOfWork.GameAccounts.GetByAccountNameAsync(
                    gameAccount.AccountName
                );
                if (existingAccount != null)
                {
                    return BadRequest("Account name already exists");
                }

                gameAccount.Id = Guid.NewGuid();
                gameAccount.CreatedAt = DateTime.UtcNow;

                await _unitOfWork.GameAccounts.AddAsync(gameAccount);

                // Commit transaction
                await _unitOfWork.CommitTransactionAsync();

                return CreatedAtAction(
                    nameof(GetGameAccount),
                    new { id = gameAccount.Id },
                    gameAccount
                );
            }
            catch (Exception)
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGameAccount(Guid id, GameAccount gameAccount)
        {
            if (id != gameAccount.Id)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var existingAccount = await _unitOfWork.GameAccounts.GetByIdAsync(id);
                if (existingAccount == null)
                {
                    return NotFound();
                }

                // Update properties
                existingAccount.Game = gameAccount.Game;
                existingAccount.AccountName = gameAccount.AccountName;
                existingAccount.Rank = gameAccount.Rank;
                existingAccount.Price = gameAccount.Price;
                existingAccount.Currency = gameAccount.Currency;
                existingAccount.IsAvailable = gameAccount.IsAvailable;
                existingAccount.CategoryId = gameAccount.CategoryId;

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
        public async Task<IActionResult> DeleteGameAccount(Guid id)
        {
            try
            {
                await _unitOfWork.BeginTransactionAsync();

                var account = await _unitOfWork.GameAccounts.GetByIdAsync(id);
                if (account == null)
                {
                    return NotFound();
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
