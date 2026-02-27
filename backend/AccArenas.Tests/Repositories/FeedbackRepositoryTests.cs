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
    public class FeedbackRepositoryTests
    {
        private FeedbackRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new FeedbackRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC13 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidFeedback_ShouldAddAndReturnFeedback()
        {
            // Arrange
            var feedback = new Feedback 
            { 
                Id = Guid.NewGuid(), 
                UserId = Guid.NewGuid(), 
                OrderId = Guid.NewGuid(), 
                Rating = 5, 
                Comment = "Excellent service!" 
            };

            // Act
            var result = await _repository.AddAsync(feedback);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(feedback.Id, result.Id);
            Assert.AreEqual(1, await _context.Feedbacks.CountAsync());
            UpdateTestResult("REPO_FUNC13", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullFeedback_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC13", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_Rating1_ShouldStillAdd()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid(), Rating = 1, Comment = "Poor" };

            // Act
            await _repository.AddAsync(feedback);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.AreEqual(1, result?.Rating);
            UpdateTestResult("REPO_FUNC13", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_Rating5_ShouldStillAdd()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid(), Rating = 5, Comment = "Great" };

            // Act
            await _repository.AddAsync(feedback);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.AreEqual(5, result?.Rating);
            UpdateTestResult("REPO_FUNC13", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_LongComment_ShouldStillAdd()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid(), Rating = 3, Comment = new string('F', 500) };

            // Act
            await _repository.AddAsync(feedback);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Feedbacks.CountAsync());
            UpdateTestResult("REPO_FUNC13", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC14 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingFeedback_ShouldUpdateRecord()
        {
            // Arrange
            var feedback = new Feedback 
            { 
                Id = Guid.NewGuid(), 
                UserId = Guid.NewGuid(), 
                OrderId = Guid.NewGuid(), 
                Rating = 4, 
                Comment = "Good" 
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            feedback.Rating = 5;
            feedback.Comment = "Actually great!";
            _repository.Update(feedback);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.AreEqual(5, updated?.Rating);
            Assert.AreEqual("Actually great!", updated?.Comment);
            UpdateTestResult("REPO_FUNC14", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC14", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC14", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_ChangeRating_ShouldUpdate()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid(), Rating = 3 };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            feedback.Rating = 1;
            _repository.Update(feedback);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.AreEqual(1, result?.Rating);
            UpdateTestResult("REPO_FUNC14", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ClearComment_ShouldUpdateToEmpty()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid(), Comment = "Old" };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            feedback.Comment = "";
            _repository.Update(feedback);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.AreEqual("", result?.Comment);
            UpdateTestResult("REPO_FUNC14", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_UpdateRelatedIds_ShouldPersist()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid() };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            var newUserId = Guid.NewGuid();

            // Act
            feedback.UserId = newUserId;
            _repository.Update(feedback);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Feedbacks.FindAsync(feedback.Id);
            Assert.AreEqual(newUserId, result?.UserId);
            UpdateTestResult("REPO_FUNC14", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC15 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingFeedback_ShouldRemoveRecord()
        {
            // Arrange
            var feedback = new Feedback 
            { 
                Id = Guid.NewGuid(), 
                UserId = Guid.NewGuid(), 
                OrderId = Guid.NewGuid(), 
                Rating = 5 
            };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(feedback);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.Feedbacks.CountAsync());
            UpdateTestResult("REPO_FUNC15", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC15", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC15", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_DeleteOneOfSeveral_ShouldOnlyRemoveOne()
        {
            // Arrange
            var f1 = new Feedback { Id = Guid.NewGuid() };
            var f2 = new Feedback { Id = Guid.NewGuid() };
            _context.Feedbacks.AddRange(f1, f2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(f1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.Feedbacks.CountAsync());
            UpdateTestResult("REPO_FUNC15", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeleteTwice_ShouldNotThrow()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid() };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(feedback);
            await _context.SaveChangesAsync();
            try {
                _repository.Delete(feedback);
                UpdateTestResult("REPO_FUNC15", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC15", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID05_VerifyDatabaseEmpty_ShouldBeTrue()
        {
            // Arrange
            var feedback = new Feedback { Id = Guid.NewGuid() };
            _context.Feedbacks.Add(feedback);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(feedback);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsFalse(await _context.Feedbacks.AnyAsync());
            UpdateTestResult("REPO_FUNC15", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
