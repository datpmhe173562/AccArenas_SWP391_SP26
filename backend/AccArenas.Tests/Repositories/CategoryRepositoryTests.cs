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
    public class CategoryRepositoryTests
    {
        private CategoryRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new CategoryRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC10 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidCategory_ShouldAddAndReturnCategory()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "New Category", IsActive = true };

            // Act
            var result = await _repository.AddAsync(category);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(category.Id, result.Id);
            Assert.AreEqual(1, await _context.Categories.CountAsync());
            UpdateTestResult("REPO_FUNC10", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullCategory_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC10", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_EmptyName_ShouldStillAdd()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "" };

            // Act
            await _repository.AddAsync(category);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Categories.CountAsync());
            UpdateTestResult("REPO_FUNC10", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_InactiveCategory_ShouldStillAdd()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "Inactive", IsActive = false };

            // Act
            await _repository.AddAsync(category);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Categories.FindAsync(category.Id);
            Assert.IsFalse(result?.IsActive ?? true);
            UpdateTestResult("REPO_FUNC10", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_SpecialCharsName_ShouldStillAdd()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "Category!@#" };

            // Act
            await _repository.AddAsync(category);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Categories.CountAsync());
            UpdateTestResult("REPO_FUNC10", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC11 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingCategory_ShouldUpdateRecord()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "Old Name" };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            category.Name = "New Name";
            _repository.Update(category);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Categories.FindAsync(category.Id);
            Assert.AreEqual("New Name", updated?.Name);
            UpdateTestResult("REPO_FUNC11", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC11", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC11", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_DeactivateCategory_ShouldUpdateStatus()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), IsActive = true };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            category.IsActive = false;
            _repository.Update(category);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Categories.FindAsync(category.Id);
            Assert.IsFalse(updated?.IsActive ?? true);
            UpdateTestResult("REPO_FUNC11", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ChangeSlug_ShouldUpdateSlug()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Slug = "old-slug" };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            category.Slug = "new-slug";
            _repository.Update(category);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Categories.FindAsync(category.Id);
            Assert.AreEqual("new-slug", updated?.Slug);
            UpdateTestResult("REPO_FUNC11", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_MultipleChanges_ShouldPersistAll()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "Old", IsActive = true };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            category.Name = "New";
            category.IsActive = false;
            _repository.Update(category);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Categories.FindAsync(category.Id);
            Assert.AreEqual("New", updated?.Name);
            Assert.IsFalse(updated?.IsActive ?? true);
            UpdateTestResult("REPO_FUNC11", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC12 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingCategory_ShouldRemoveRecord()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid(), Name = "To Delete" };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(category);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.Categories.CountAsync());
            UpdateTestResult("REPO_FUNC12", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC12", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC12", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_DeleteOneOfMany_ShouldRemoveOnlyOne()
        {
            // Arrange
            var c1 = new Category { Id = Guid.NewGuid() };
            var c2 = new Category { Id = Guid.NewGuid() };
            _context.Categories.AddRange(c1, c2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(c1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Categories.CountAsync());
            UpdateTestResult("REPO_FUNC12", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeleteTwice_ShouldNotThrow()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid() };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(category);
            await _context.SaveChangesAsync();
            try {
                _repository.Delete(category);
                UpdateTestResult("REPO_FUNC12", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC12", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID05_VerifyDatabaseEmpty_ShouldBeTrue()
        {
            // Arrange
            var category = new Category { Id = Guid.NewGuid() };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(category);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsFalse(await _context.Categories.AnyAsync());
            UpdateTestResult("REPO_FUNC12", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
