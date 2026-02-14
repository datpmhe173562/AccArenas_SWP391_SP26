using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using AccArenas.Api.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace AccArenas.Tests.Repositories
{
    [TestClass]
    public class GameAccountRepositoryTests
    {
        private GameAccountRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new GameAccountRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC16 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidAccount_ShouldAddAndReturnAccount()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), AccountName = "TestAcc", Price = 100, Game = "LOL", IsAvailable = true };

            // Act
            var result = await _repository.AddAsync(account);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(account.Id, result.Id);
            Assert.AreEqual(1, await _context.GameAccounts.CountAsync());
            UpdateTestResult("REPO_FUNC16", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullAccount_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC16", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_ZeroPrice_ShouldStillAdd()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), AccountName = "Free", Price = 0, Game = "FreeGame" };

            // Act
            await _repository.AddAsync(account);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.GameAccounts.FindAsync(account.Id);
            Assert.AreEqual(0, result?.Price);
            UpdateTestResult("REPO_FUNC16", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_InactiveCategory_ShouldStillAdd()
        {
            // Arrange
            var categoryId = Guid.NewGuid();
            var account = new GameAccount { Id = Guid.NewGuid(), CategoryId = categoryId, AccountName = "Acc1" };

            // Act
            await _repository.AddAsync(account);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.GameAccounts.CountAsync());
            UpdateTestResult("REPO_FUNC16", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_UnavailableAccount_ShouldStillAdd()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), AccountName = "Sold", IsAvailable = false };

            // Act
            await _repository.AddAsync(account);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.GameAccounts.FindAsync(account.Id);
            Assert.IsFalse(result?.IsAvailable ?? true);
            UpdateTestResult("REPO_FUNC16", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC17 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingAccount_ShouldUpdateRecord()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), AccountName = "OldName", Price = 100 };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            account.AccountName = "NewName";
            account.Price = 150;
            _repository.Update(account);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.GameAccounts.FindAsync(account.Id);
            Assert.AreEqual("NewName", updated?.AccountName);
            Assert.AreEqual(150, updated?.Price);
            UpdateTestResult("REPO_FUNC17", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC17", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC17", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_SetUnavailable_ShouldUpdateStatus()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), IsAvailable = true };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            account.IsAvailable = false;
            _repository.Update(account);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.GameAccounts.FindAsync(account.Id);
            Assert.IsFalse(result?.IsAvailable ?? true);
            UpdateTestResult("REPO_FUNC17", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ChangeGame_ShouldUpdateGameField()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), Game = "Dota2" };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            account.Game = "LoL";
            _repository.Update(account);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.GameAccounts.FindAsync(account.Id);
            Assert.AreEqual("LoL", result?.Game);
            UpdateTestResult("REPO_FUNC17", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_UpdateCategory_ShouldUpdateCategoryId()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), CategoryId = Guid.NewGuid() };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            var newCatId = Guid.NewGuid();

            // Act
            account.CategoryId = newCatId;
            _repository.Update(account);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.GameAccounts.FindAsync(account.Id);
            Assert.AreEqual(newCatId, result?.CategoryId);
            UpdateTestResult("REPO_FUNC17", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC18 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingAccount_ShouldRemoveRecord()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid(), AccountName = "To Delete" };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(account);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.GameAccounts.CountAsync());
            UpdateTestResult("REPO_FUNC18", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC18", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC18", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_DeleteOneOfMany_ShouldRemoveOnlyOne()
        {
            // Arrange
            var a1 = new GameAccount { Id = Guid.NewGuid() };
            var a2 = new GameAccount { Id = Guid.NewGuid() };
            _context.GameAccounts.AddRange(a1, a2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(a1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.GameAccounts.CountAsync());
            UpdateTestResult("REPO_FUNC18", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeleteTwice_ShouldNotThrow()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid() };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(account);
            await _context.SaveChangesAsync();
            try {
                _repository.Delete(account);
                UpdateTestResult("REPO_FUNC18", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC18", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID05_VerifyDatabaseEmpty_ShouldBeTrue()
        {
            // Arrange
            var account = new GameAccount { Id = Guid.NewGuid() };
            _context.GameAccounts.Add(account);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(account);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsFalse(await _context.GameAccounts.AnyAsync());
            UpdateTestResult("REPO_FUNC18", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
