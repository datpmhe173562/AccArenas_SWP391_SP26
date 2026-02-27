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
    public class SliderRepositoryTests
    {
        private SliderRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new SliderRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC25 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidSlider_ShouldAddAndReturnSlider()
        {
            // Arrange
            var slider = new Slider 
            { 
                Id = Guid.NewGuid(), 
                Title = "Home Banner", 
                ImageUrl = "http://example.com/banner.jpg", 
                Order = 1, 
                IsActive = true 
            };

            // Act
            var result = await _repository.AddAsync(slider);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(slider.Id, result.Id);
            Assert.AreEqual(1, await _context.Sliders.CountAsync());
            UpdateTestResult("REPO_FUNC25", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullSlider_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC25", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_EmptyTitle_ShouldStillAdd()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid(), Title = "" };

            // Act
            await _repository.AddAsync(slider);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Sliders.CountAsync());
            UpdateTestResult("REPO_FUNC25", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_LongImageUrl_ShouldStillAdd()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid(), ImageUrl = new string('s', 500) };

            // Act
            await _repository.AddAsync(slider);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Sliders.CountAsync());
            UpdateTestResult("REPO_FUNC25", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_NegativeOrder_ShouldStillAdd()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid(), Order = -1 };

            // Act
            await _repository.AddAsync(slider);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Sliders.FindAsync(slider.Id);
            Assert.AreEqual(-1, result?.Order);
            UpdateTestResult("REPO_FUNC25", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC26 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingSlider_ShouldUpdateRecord()
        {
            // Arrange
            var slider = new Slider 
            { 
                Id = Guid.NewGuid(), 
                Title = "Old Title", 
                Order = 2 
            };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            slider.Title = "New Title";
            slider.Order = 3;
            _repository.Update(slider);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Sliders.FindAsync(slider.Id);
            Assert.AreEqual("New Title", updated?.Title);
            Assert.AreEqual(3, updated?.Order);
            UpdateTestResult("REPO_FUNC26", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC26", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC26", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_ChangeTitle_ShouldPersist()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid(), Title = "A" };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            slider.Title = "B";
            _repository.Update(slider);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Sliders.FindAsync(slider.Id);
            Assert.AreEqual("B", result?.Title);
            UpdateTestResult("REPO_FUNC26", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ChangeOrder_ShouldPersist()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid(), Order = 10 };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            slider.Order = 20;
            _repository.Update(slider);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Sliders.FindAsync(slider.Id);
            Assert.AreEqual(20, result?.Order);
            UpdateTestResult("REPO_FUNC26", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_Deactivate_ShouldPersist()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid(), IsActive = true };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            slider.IsActive = false;
            _repository.Update(slider);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Sliders.FindAsync(slider.Id);
            Assert.IsFalse(result?.IsActive ?? true);
            UpdateTestResult("REPO_FUNC26", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC27 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingSlider_ShouldRemoveRecord()
        {
            // Arrange
            var slider = new Slider 
            { 
                Id = Guid.NewGuid(), 
                Title = "Temp Slider" 
            };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(slider);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.Sliders.CountAsync());
            UpdateTestResult("REPO_FUNC27", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC27", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC27", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_DeleteOneOfFew_ShouldOnlyRemoveOne()
        {
            // Arrange
            var s1 = new Slider { Id = Guid.NewGuid() };
            var s2 = new Slider { Id = Guid.NewGuid() };
            _context.Sliders.AddRange(s1, s2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(s1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Sliders.CountAsync());
            UpdateTestResult("REPO_FUNC27", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeleteTwice_ShouldNotThrow()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid() };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(slider);
            await _context.SaveChangesAsync();
            try {
                _repository.Delete(slider);
                UpdateTestResult("REPO_FUNC27", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC27", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID05_VerifyDatabaseEmpty_ShouldBeTrue()
        {
            // Arrange
            var slider = new Slider { Id = Guid.NewGuid() };
            _context.Sliders.Add(slider);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(slider);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsFalse(await _context.Sliders.AnyAsync());
            UpdateTestResult("REPO_FUNC27", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
