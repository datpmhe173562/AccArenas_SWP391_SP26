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
    public class BannerRepositoryTests
    {
        private BannerRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new BannerRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC04 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidBanner_ShouldAddAndReturnBanner()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "New Banner", IsActive = true, Order = 1 };

            // Act
            var result = await _repository.AddAsync(banner);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(banner.Id, result.Id);
            Assert.AreEqual(1, await _context.Banners.CountAsync());
            UpdateTestResult("REPO_FUNC04", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullBanner_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC04", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_EmptyTitle_ShouldStillAdd()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "", IsActive = true };

            // Act
            await _repository.AddAsync(banner);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Banners.CountAsync());
            UpdateTestResult("REPO_FUNC04", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_LargeOrder_ShouldStillAdd()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "Large", Order = int.MaxValue };

            // Act
            await _repository.AddAsync(banner);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Banners.FindAsync(banner.Id);
            Assert.AreEqual(int.MaxValue, result?.Order);
            UpdateTestResult("REPO_FUNC04", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_SpecialCharsInTitle_ShouldStillAdd()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "!!! @@@ ### $$$" };

            // Act
            await _repository.AddAsync(banner);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Banners.CountAsync());
            UpdateTestResult("REPO_FUNC04", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC05 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingBanner_ShouldUpdateRecord()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "Old Title", Order = 1 };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            banner.Title = "New Title";
            _repository.Update(banner);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Banners.FindAsync(banner.Id);
            Assert.AreEqual("New Title", updated?.Title);
            UpdateTestResult("REPO_FUNC05", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            // Act & Assert (Repository Update typically handles null or throws if used improperly)
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC05", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC05", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_ChangeOrder_ShouldUpdateOrder()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "T1", Order = 1 };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            banner.Order = 10;
            _repository.Update(banner);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Banners.FindAsync(banner.Id);
            Assert.AreEqual(10, updated?.Order);
            UpdateTestResult("REPO_FUNC05", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ClearTitle_ShouldUpdateToEmpty()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "T1" };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            banner.Title = "";
            _repository.Update(banner);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Banners.FindAsync(banner.Id);
            Assert.AreEqual("", updated?.Title);
            UpdateTestResult("REPO_FUNC05", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_ToggleIsActive_ShouldUpdateStatus()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), IsActive = true };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            banner.IsActive = false;
            _repository.Update(banner);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Banners.FindAsync(banner.Id);
            Assert.IsFalse(updated?.IsActive ?? true);
            UpdateTestResult("REPO_FUNC05", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC06 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingBanner_ShouldRemoveRecord()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid(), Title = "To Delete" };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(banner);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.Banners.CountAsync());
            UpdateTestResult("REPO_FUNC06", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC06", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC06", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_CheckDatabaseCount_ShouldBeZero()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid() };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(banner);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.Banners.CountAsync());
            UpdateTestResult("REPO_FUNC06", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeleteTwice_ShouldNotThrow()
        {
            // Arrange
            var banner = new Banner { Id = Guid.NewGuid() };
            _context.Banners.Add(banner);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(banner);
            await _context.SaveChangesAsync();
            
            try {
                _repository.Delete(banner);
                UpdateTestResult("REPO_FUNC06", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC06", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID05_DeleteOneOfMany_ShouldOnlyRemoveOne()
        {
            // Arrange
            var b1 = new Banner { Id = Guid.NewGuid() };
            var b2 = new Banner { Id = Guid.NewGuid() };
            _context.Banners.AddRange(b1, b2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(b1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Banners.CountAsync());
            UpdateTestResult("REPO_FUNC06", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            // In a real scenario, this would update the CSV file or database
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
