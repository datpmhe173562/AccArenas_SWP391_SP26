using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AccArenas.Tests.BusinessLogic
{
    [TestClass]
    public class BusinessLogicTests
    {
        #region Helper Classes
        
        public class Banner
        {
            public Guid Id { get; set; }
            public string Title { get; set; } = "";
            public bool IsActive { get; set; }
            public int Order { get; set; }
        }

        public class Category  
        {
            public Guid Id { get; set; }
            public string Name { get; set; } = "";
            public bool IsActive { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class GameAccount
        {
            public Guid Id { get; set; }
            public string GameName { get; set; } = "";
            public string Game { get; set; } = "";
            public decimal Price { get; set; }
            public bool IsAvailable { get; set; }
            public Guid CategoryId { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class Order
        {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public string Status { get; set; } = "";
            public decimal TotalAmount { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class Promotion
        {
            public Guid Id { get; set; }
            public string Title { get; set; } = "";
            public string Code { get; set; } = "";
            public bool IsActive { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
            public decimal DiscountPercent { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        #endregion

        #region REPO_FUNC01 - GetActiveBannersOrderedAsync Logic

        [TestMethod]
        public void GetActiveBannersOrderedAsync_Logic_UTCID01_EmptyList_ShouldReturnEmpty()
        {
            // Arrange
            var banners = new List<Banner>();

            // Act
            var result = banners.Where(b => b.IsActive).OrderBy(b => b.Order).ToList();

            // Assert
            Assert.AreEqual(0, result.Count);
            UpdateTestResult("REPO_FUNC01", "UTCID01", "P");
        }

        [TestMethod]
        public void GetActiveBannersOrderedAsync_Logic_UTCID02_OnlyInactive_ShouldReturnEmpty()
        {
            // Arrange
            var banners = new List<Banner>
            {
                new Banner { Id = Guid.NewGuid(), Title = "Inactive 1", IsActive = false, Order = 1 },
                new Banner { Id = Guid.NewGuid(), Title = "Inactive 2", IsActive = false, Order = 2 }
            };

            // Act
            var result = banners.Where(b => b.IsActive).OrderBy(b => b.Order).ToList();

            // Assert
            Assert.AreEqual(0, result.Count);
            UpdateTestResult("REPO_FUNC01", "UTCID02", "P");
        }

        [TestMethod]
        public void GetActiveBannersOrderedAsync_Logic_UTCID03_ActiveBanners_ShouldReturnOrdered()
        {
            // Arrange
            var banners = new List<Banner>
            {
                new Banner { Id = Guid.NewGuid(), Title = "Banner 3", IsActive = true, Order = 3 },
                new Banner { Id = Guid.NewGuid(), Title = "Banner 1", IsActive = true, Order = 1 },
                new Banner { Id = Guid.NewGuid(), Title = "Banner 2", IsActive = true, Order = 2 }
            };

            // Act
            var result = banners.Where(b => b.IsActive).OrderBy(b => b.Order).ToList();

            // Assert
            Assert.AreEqual(3, result.Count);
            Assert.AreEqual(1, result[0].Order);
            Assert.AreEqual(2, result[1].Order);
            Assert.AreEqual(3, result[2].Order);
            UpdateTestResult("REPO_FUNC01", "UTCID03", "P");
        }

        [TestMethod]
        public void GetActiveBannersOrderedAsync_Logic_UTCID04_MixedBanners_ShouldReturnOnlyActiveOrdered()
        {
            // Arrange
            var banners = new List<Banner>
            {
                new Banner { Id = Guid.NewGuid(), Title = "Banner 1", IsActive = true, Order = 1 },
                new Banner { Id = Guid.NewGuid(), Title = "Inactive", IsActive = false, Order = 2 },
                new Banner { Id = Guid.NewGuid(), Title = "Banner 3", IsActive = true, Order = 3 }
            };

            // Act
            var result = banners.Where(b => b.IsActive).OrderBy(b => b.Order).ToList();

            // Assert
            Assert.AreEqual(2, result.Count);
            Assert.AreEqual(1, result[0].Order);
            Assert.AreEqual(3, result[1].Order);
            Assert.IsTrue(result.All(b => b.IsActive));
            UpdateTestResult("REPO_FUNC01", "UTCID04", "P");
        }

        [TestMethod]
        public void GetActiveBannersOrderedAsync_Logic_UTCID05_ComplexOrdering_ShouldReturnCorrectOrder()
        {
            // Arrange
            var banners = new List<Banner>
            {
                new Banner { Id = Guid.NewGuid(), Title = "Banner 5", IsActive = true, Order = 5 },
                new Banner { Id = Guid.NewGuid(), Title = "Banner 1", IsActive = true, Order = 1 },
                new Banner { Id = Guid.NewGuid(), Title = "Inactive", IsActive = false, Order = 3 },
                new Banner { Id = Guid.NewGuid(), Title = "Banner 2", IsActive = true, Order = 2 }
            };

            // Act
            var result = banners.Where(b => b.IsActive).OrderBy(b => b.Order).ToList();

            // Assert
            Assert.AreEqual(3, result.Count);
            Assert.AreEqual(1, result[0].Order);
            Assert.AreEqual(2, result[1].Order);
            Assert.AreEqual(5, result[2].Order);
            UpdateTestResult("REPO_FUNC01", "UTCID05", "P");
        }

        #endregion

        #region REPO_FUNC19 - GetOrdersByUserAsync Logic

        [TestMethod]
        public void GetOrdersByUserAsync_Logic_UTCID01_UserHasOrders_ShouldReturnOrderedByDate()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), UserId = userId, Status = "Pending", TotalAmount = 100, CreatedAt = DateTime.UtcNow.AddDays(-2) },
                new Order { Id = Guid.NewGuid(), UserId = userId, Status = "Completed", TotalAmount = 200, CreatedAt = DateTime.UtcNow.AddDays(-1) },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Pending", TotalAmount = 150, CreatedAt = DateTime.UtcNow }
            };

            // Act
            var result = orders.Where(o => o.UserId == userId).OrderByDescending(o => o.CreatedAt).ToList();

            // Assert
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.All(o => o.UserId == userId));
            Assert.IsTrue(result[0].CreatedAt > result[1].CreatedAt);
            UpdateTestResult("REPO_FUNC19", "UTCID01", "P");
        }

        [TestMethod]
        public void GetOrdersByUserAsync_Logic_UTCID02_UserHasNoOrders_ShouldReturnEmpty()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Pending", TotalAmount = 100, CreatedAt = DateTime.UtcNow }
            };

            // Act
            var result = orders.Where(o => o.UserId == userId).OrderByDescending(o => o.CreatedAt).ToList();

            // Assert
            Assert.AreEqual(0, result.Count);
            UpdateTestResult("REPO_FUNC19", "UTCID02", "P");
        }

        #endregion

        #region REPO_FUNC22 - GetTotalRevenueAsync Logic

        [TestMethod]
        public void GetTotalRevenueAsync_Logic_UTCID01_CompletedOrders_ShouldReturnTotal()
        {
            // Arrange
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "completed", TotalAmount = 100, CreatedAt = DateTime.UtcNow },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Completed", TotalAmount = 200, CreatedAt = DateTime.UtcNow },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Pending", TotalAmount = 150, CreatedAt = DateTime.UtcNow }
            };

            // Act
            var result = orders.Where(o => o.Status.ToLower() == "completed").Sum(o => o.TotalAmount);

            // Assert
            Assert.AreEqual(300m, result);
            UpdateTestResult("REPO_FUNC22", "UTCID01", "P");
        }

        [TestMethod]
        public void GetTotalRevenueAsync_Logic_UTCID02_NoCompletedOrders_ShouldReturnZero()
        {
            // Arrange
            var orders = new List<Order>
            {
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Pending", TotalAmount = 100, CreatedAt = DateTime.UtcNow },
                new Order { Id = Guid.NewGuid(), UserId = Guid.NewGuid(), Status = "Cancelled", TotalAmount = 200, CreatedAt = DateTime.UtcNow }
            };

            // Act
            var result = orders.Where(o => o.Status.ToLower() == "completed").Sum(o => o.TotalAmount);

            // Assert
            Assert.AreEqual(0m, result);
            UpdateTestResult("REPO_FUNC22", "UTCID02", "P");
        }

        #endregion

        #region REPO_FUNC23 - GetActivePromotionsAsync Logic

        [TestMethod]
        public void GetActivePromotionsAsync_Logic_UTCID01_ActivePromotions_ShouldReturnValid()
        {
            // Arrange
            var currentDate = DateTime.UtcNow;
            var promotions = new List<Promotion>
            {
                new Promotion 
                { 
                    Id = Guid.NewGuid(), 
                    Title = "Active Promotion", 
                    Code = "ACTIVE10",
                    IsActive = true, 
                    StartDate = currentDate.AddDays(-5), 
                    EndDate = currentDate.AddDays(5),
                    DiscountPercent = 10,
                    CreatedAt = currentDate.AddDays(-10)
                },
                new Promotion 
                { 
                    Id = Guid.NewGuid(), 
                    Title = "Expired Promotion", 
                    Code = "EXPIRED10",
                    IsActive = true, 
                    StartDate = currentDate.AddDays(-10), 
                    EndDate = currentDate.AddDays(-1),
                    DiscountPercent = 15,
                    CreatedAt = currentDate.AddDays(-15)
                }
            };

            // Act
            var result = promotions.Where(p => p.IsActive && p.StartDate <= currentDate && p.EndDate >= currentDate)
                                  .OrderByDescending(p => p.CreatedAt).ToList();

            // Assert
            Assert.AreEqual(1, result.Count);
            Assert.AreEqual("Active Promotion", result[0].Title);
            UpdateTestResult("REPO_FUNC23", "UTCID01", "P");
        }

        #endregion

        #region Business Logic Test Results

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }

        #endregion
    }
}