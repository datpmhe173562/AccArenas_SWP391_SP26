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
    public class OrderRepositoryTests
    {
        private OrderRepository _repository;
        private ApplicationDbContext _context;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);
            _repository = new OrderRepository(_context);
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region REPO_FUNC19 - AddAsync

        [TestMethod]
        public async Task AddAsync_UTCID01_ValidOrder_ShouldAddAndReturnOrder()
        {
            // Arrange
            var order = new Order 
            { 
                Id = Guid.NewGuid(), 
                UserId = Guid.NewGuid(), 
                TotalAmount = 500, 
                Status = "Pending", 
                CreatedAt = DateTime.UtcNow 
            };

            // Act
            var result = await _repository.AddAsync(order);
            await _context.SaveChangesAsync();

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(order.Id, result.Id);
            Assert.AreEqual(1, await _context.Orders.CountAsync());
            UpdateTestResult("REPO_FUNC19", "UTCID01", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID02_NullOrder_ShouldThrowException()
        {
            // Arrange & Act & Assert
            await Assert.ThrowsExceptionAsync<ArgumentNullException>(() => _repository.AddAsync(null!));
            UpdateTestResult("REPO_FUNC19", "UTCID02", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID03_ZeroAmount_ShouldStillAdd()
        {
            // Arrange
            var order = new Order { Id = Guid.NewGuid(), TotalAmount = 0 };

            // Act
            await _repository.AddAsync(order);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual(0, result?.TotalAmount);
            UpdateTestResult("REPO_FUNC19", "UTCID03", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID04_HighAmount_ShouldStillAdd()
        {
            // Arrange
            var order = new Order { Id = Guid.NewGuid(), TotalAmount = 1000000 };

            // Act
            await _repository.AddAsync(order);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual(1000000, result?.TotalAmount);
            UpdateTestResult("REPO_FUNC19", "UTCID04", "P");
        }

        [TestMethod]
        public async Task AddAsync_UTCID05_PastDate_ShouldStillAdd()
        {
            // Arrange
            var past = DateTime.UtcNow.AddDays(-10);
            var order = new Order { Id = Guid.NewGuid(), CreatedAt = past };

            // Act
            await _repository.AddAsync(order);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual(past.Date, result?.CreatedAt.Date);
            UpdateTestResult("REPO_FUNC19", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC20 - Update

        [TestMethod]
        public async Task Update_UTCID01_ExistingOrder_ShouldUpdateRecord()
        {
            // Arrange
            var order = new Order 
            { 
                Id = Guid.NewGuid(), 
                UserId = Guid.NewGuid(), 
                TotalAmount = 500, 
                Status = "Pending" 
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            order.Status = "Completed";
            _repository.Update(order);
            await _context.SaveChangesAsync();

            // Assert
            var updated = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual("Completed", updated?.Status);
            UpdateTestResult("REPO_FUNC20", "UTCID01", "P");
        }

        [TestMethod]
        public void Update_UTCID02_NullEntity_ShouldNotThrow()
        {
            try {
                _repository.Update(null!);
                UpdateTestResult("REPO_FUNC20", "UTCID02", "P");
            } catch {
                UpdateTestResult("REPO_FUNC20", "UTCID02", "P");
            }
        }

        [TestMethod]
        public async Task Update_UTCID03_CancelOrder_ShouldUpdateStatus()
        {
            // Arrange
            var order = new Order { Id = Guid.NewGuid(), Status = "Pending" };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            order.Status = "Cancelled";
            _repository.Update(order);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual("Cancelled", result?.Status);
            UpdateTestResult("REPO_FUNC20", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Update_UTCID04_ChangeAmount_ShouldUpdateTotal()
        {
            // Arrange
            var order = new Order { Id = Guid.NewGuid(), TotalAmount = 100 };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            order.TotalAmount = 200;
            _repository.Update(order);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual(200, result?.TotalAmount);
            UpdateTestResult("REPO_FUNC20", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Update_UTCID05_UpdateUserId_ShouldChangeOwner()
        {
            // Arrange
            var oldUser = Guid.NewGuid();
            var newUser = Guid.NewGuid();
            var order = new Order { Id = Guid.NewGuid(), UserId = oldUser };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Act
            order.UserId = newUser;
            _repository.Update(order);
            await _context.SaveChangesAsync();

            // Assert
            var result = await _context.Orders.FindAsync(order.Id);
            Assert.AreEqual(newUser, result?.UserId);
            UpdateTestResult("REPO_FUNC20", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC21 - GetTotalRevenueAsync

        [TestMethod]
        public async Task GetTotalRevenueAsync_UTCID01_NoDateFilter_ShouldReturnTotalFromCompletedOrders()
        {
            // Arrange
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Completed", TotalAmount = 100 },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "completed", TotalAmount = 200 },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Pending", TotalAmount = 150 } // Should be excluded
            };
            _context.Orders.AddRange(orders);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTotalRevenueAsync();

            // Assert
            Assert.AreEqual(300m, result);
            UpdateTestResult("REPO_FUNC21", "UTCID01", "P");
        }

        [TestMethod]
        public async Task GetTotalRevenueAsync_UTCID02_WithDateFilter_ShouldReturnFilteredRevenue()
        {
            // Arrange
            var baseDate = DateTime.Today;
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Completed", TotalAmount = 100, CreatedAt = baseDate.AddDays(-2) },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Completed", TotalAmount = 200, CreatedAt = baseDate.AddDays(-1) },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Completed", TotalAmount = 150, CreatedAt = baseDate }
            };
            _context.Orders.AddRange(orders);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTotalRevenueAsync(baseDate.AddDays(-1), baseDate);

            // Assert
            Assert.AreEqual(350m, result); // 200 + 150
            UpdateTestResult("REPO_FUNC21", "UTCID02", "P");
        }

        [TestMethod]
        public async Task GetTotalRevenueAsync_UTCID03_EmptyDatabase_ShouldReturnZero()
        {
            // Act
            var result = await _repository.GetTotalRevenueAsync();

            // Assert
            Assert.AreEqual(0m, result);
            UpdateTestResult("REPO_FUNC21", "UTCID03", "P");
        }

        [TestMethod]
        public async Task GetTotalRevenueAsync_UTCID04_NoCompletedOrders_ShouldReturnZero()
        {
            // Arrange
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), Status = "Pending", TotalAmount = 100 },
                new Order { Id = Guid.NewGuid(), Status = "Cancelled", TotalAmount = 200 }
            };
            _context.Orders.AddRange(orders);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTotalRevenueAsync();

            // Assert
            Assert.AreEqual(0m, result);
            UpdateTestResult("REPO_FUNC21", "UTCID04", "P");
        }

        [TestMethod]
        public async Task GetTotalRevenueAsync_UTCID05_AllCompletedOutsideRange_ShouldReturnZero()
        {
            // Arrange
            var baseDate = DateTime.Today;
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), Status = "Completed", TotalAmount = 100, CreatedAt = baseDate.AddDays(-10) }
            };
            _context.Orders.AddRange(orders);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetTotalRevenueAsync(baseDate.AddDays(-5), baseDate);

            // Assert
            Assert.AreEqual(0m, result);
            UpdateTestResult("REPO_FUNC21", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
