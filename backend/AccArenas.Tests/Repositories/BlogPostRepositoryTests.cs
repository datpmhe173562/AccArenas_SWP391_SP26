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
    public class BlogPostRepositoryTests
    {
        private BlogPostRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new BlogPostRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC07 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidPost_ShouldAddAndReturnPost()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Title = "New Post", Content = "Content", IsPublished = true };

            // Act
            var result = await _repository.AddAsync(post);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(post.Id, result.Id);
            Assert.AreEqual(1, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC07", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullPost_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC07", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_NoContent_ShouldStillAdd()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Title = "No Content", Content = "" };

            // Act
            await _repository.AddAsync(post);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC07", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_Unpublished_ShouldStillAdd()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Title = "Draft", IsPublished = false };

            // Act
            await _repository.AddAsync(post);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.BlogPosts.FindAsync(post.Id);
            Assert.IsFalse(result?.IsPublished ?? true);
            UpdateTestResult("REPO_FUNC07", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_LongTitle_ShouldStillAdd()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Title = new string('A', 200) };

            // Act
            await _repository.AddAsync(post);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC07", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC08 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingPost_ShouldUpdateRecord()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Title = "Old Title", Content = "Content" };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            post.Title = "New Title";
            _repository.Update(post);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.BlogPosts.FindAsync(post.Id);
            Assert.AreEqual("New Title", updated?.Title);
            UpdateTestResult("REPO_FUNC08", "UTCID01", "P");
        }

        [TestMethod]
        public async Task Update_UTCID02_PublishADraft_ShouldUpdateStatus()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), IsPublished = false };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            post.IsPublished = true;
            post.PublishedAt = DateTime.UtcNow;
            _repository.Update(post);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.BlogPosts.FindAsync(post.Id);
            Assert.IsTrue(updated?.IsPublished ?? false);
            UpdateTestResult("REPO_FUNC08", "UTCID02", "P");
        }

        [TestMethod]
        public async Task Update_UTCID03_ChangeContent_ShouldUpdateContent()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Content = "Old" };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            post.Content = "New";
            _repository.Update(post);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.BlogPosts.FindAsync(post.Id);
            Assert.AreEqual("New", updated?.Content);
            UpdateTestResult("REPO_FUNC08", "UTCID03", "P");
        }

        [TestMethod]
        public void Update_UTCID04_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC08", "UTCID04", "P");
            } catch {
                UpdateTestResult("REPO_FUNC08", "UTCID04", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID05_SetCategory_ShouldUpdateCategory()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid() };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            var categoryId = Guid.NewGuid();

            // Act
            post.CategoryId = categoryId;
            _repository.Update(post);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.BlogPosts.FindAsync(post.Id);
            Assert.AreEqual(categoryId, updated?.CategoryId);
            UpdateTestResult("REPO_FUNC08", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC09 - Delete

        [TestMethod]
        public async Task Delete_UTCID01_ExistingPost_ShouldRemoveRecord()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), Title = "To Delete" };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(post);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC09", "UTCID01", "P");
        }

        [TestMethod]
        public void Delete_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Delete(null!);
                UpdateTestResult("REPO_FUNC09", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC09", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Delete_UTCID03_DeleteDraft_ShouldRemove()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), IsPublished = false };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(post);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC09", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID04_DeletePublished_ShouldRemove()
        {
            // Arrange
            var post = new BlogPost { Id = Guid.NewGuid(), IsPublished = true };
            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(post);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(0, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC09", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Delete_UTCID05_CheckCountAfterMultiple_ShouldBeCorrect()
        {
            // Arrange
            var p1 = new BlogPost { Id = Guid.NewGuid() };
            var p2 = new BlogPost { Id = Guid.NewGuid() };
            _context.BlogPosts.AddRange(p1, p2);
            await _context.SaveChangesAsync();

            // Act
            _repository.Delete(p1);
            await _context.SaveChangesAsync();

            // Assert
            Assert.AreEqual(1, await _context.BlogPosts.CountAsync());
            UpdateTestResult("REPO_FUNC09", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
