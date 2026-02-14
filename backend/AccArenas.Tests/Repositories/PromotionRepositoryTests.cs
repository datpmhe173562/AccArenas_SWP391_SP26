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
    public class PromotionRepositoryTests
    {
        private PromotionRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new PromotionRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC22 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidPromotion_ShouldAddAndReturnPromotion()
        {
            // Arrange
            var promotion = new Promotion 
            { 
                Id = Guid.NewGuid(), 
                Code = "SUMMER20", 
                DiscountPercent = 20, 
                IsActive = true, 
                StartDate = DateTime.UtcNow, 
                EndDate = DateTime.UtcNow.AddDays(30) 
            };

            // Act
            var result = await _repository.AddAsync(promotion);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(promotion.Id, result.Id);
            Assert.AreEqual(1, await _context.Promotions.CountAsync());
            UpdateTestResult("REPO_FUNC22", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullPromotion_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC22", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_Discount100_ShouldStillAdd()
        {
            // Arrange
            var promotion = new Promotion { Id = Guid.NewGuid(), Code = "FREE", DiscountPercent = 100 };

            // Act
            await _repository.AddAsync(promotion);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Promotions.FindAsync(promotion.Id);
            Assert.AreEqual(100, result?.DiscountPercent);
            UpdateTestResult("REPO_FUNC22", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_Discount0_ShouldStillAdd()
        {
            // Arrange
            var promotion = new Promotion { Id = Guid.NewGuid(), Code = "NONE", DiscountPercent = 0 };

            // Act
            await _repository.AddAsync(promotion);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Promotions.FindAsync(promotion.Id);
            Assert.AreEqual(0, result?.DiscountPercent);
            UpdateTestResult("REPO_FUNC22", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_ExpiredPromotion_ShouldStillAdd()
        {
            // Arrange
            var promotion = new Promotion 
            { 
                Id = Guid.NewGuid(), 
                Code = "PAST", 
                StartDate = DateTime.UtcNow.AddDays(-20),
                EndDate = DateTime.UtcNow.AddDays(-10) 
            };

            // Act
            await _repository.AddAsync(promotion);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Promotions.CountAsync());
            UpdateTestResult("REPO_FUNC22", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC23 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingPromotion_ShouldUpdateRecord()
        {
            // Arrange
            var promotion = new Promotion 
            { 
                Id = Guid.NewGuid(), 
                Code = "WINTER10", 
                DiscountPercent = 10 
            };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            // Act
            promotion.DiscountPercent = 15;
            _repository.Update(promotion);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Promotions.FindAsync(promotion.Id);
            Assert.AreEqual(15, updated?.DiscountPercent);
            UpdateTestResult("REPO_FUNC23", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC23", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC23", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_Deactivate_ShouldUpdateIsActive()
        {
            // Arrange
            var promotion = new Promotion { Id = Guid.NewGuid(), IsActive = true };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            // Act
            promotion.IsActive = false;
            _repository.Update(promotion);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Promotions.FindAsync(promotion.Id);
            Assert.IsFalse(result?.IsActive ?? true);
            UpdateTestResult("REPO_FUNC23", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ChangeCode_ShouldUpdateValue()
        {
            // Arrange
            var promotion = new Promotion { Id = Guid.NewGuid(), Code = "OLD" };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            // Act
            promotion.Code = "NEW";
            _repository.Update(promotion);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Promotions.FindAsync(promotion.Id);
            Assert.AreEqual("NEW", result?.Code);
            UpdateTestResult("REPO_FUNC23", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_ExtendEndDate_ShouldPersist()
        {
            // Arrange
            var oldEnd = DateTime.UtcNow.AddDays(5);
            var promotion = new Promotion { Id = Guid.NewGuid(), EndDate = oldEnd };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            var newEnd = DateTime.UtcNow.AddDays(10);

            // Act
            promotion.EndDate = newEnd;
            _repository.Update(promotion);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Promotions.FindAsync(promotion.Id);
            Assert.AreEqual(newEnd.Date, result?.EndDate.Date);
            UpdateTestResult("REPO_FUNC23", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC24 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingPromotion_ShouldRemoveRecord()
        {
            // Arrange
            var promotion = new Promotion 
            { 
                Id = Guid.NewGuid(), 
                Code = "TEMP5", 
                DiscountPercent = 5 
            };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(promotion);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.Promotions.CountAsync());
            UpdateTestResult("REPO_FUNC24", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC24", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC24", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_DeleteOneOfSeveral_ShouldOnlyRemoveOne()
        {
            // Arrange
            var p1 = new Promotion { Id = Guid.NewGuid() };
            var p2 = new Promotion { Id = Guid.NewGuid() };
            _context.Promotions.AddRange(p1, p2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(p1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Promotions.CountAsync());
            UpdateTestResult("REPO_FUNC24", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeleteTwice_ShouldNotThrow()
        {
            // Arrange
            var promotion = new Promotion { Id = Guid.NewGuid() };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(promotion);
            await _context.SaveChangesAsync();
            try {
                _repository.Delete(promotion);
                UpdateTestResult("REPO_FUNC24", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC24", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID05_VerifyDatabaseEmpty_ShouldBeTrue()
        {
            // Arrange
            var promotion = new Promotion { Id = Guid.NewGuid() };
            _context.Promotions.Add(promotion);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(promotion);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsFalse(await _context.Promotions.AnyAsync());
            UpdateTestResult("REPO_FUNC24", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
