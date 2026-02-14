using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace AccArenas.Tests.Services
{
    [TestClass]
    public class JwtServiceTests
    {
        private JwtService _jwtService;
        private Mock<IConfiguration> _mockConfiguration;
        private Mock<IConfigurationSection> _mockJwtSection;
        private ApplicationDbContext _context;
        private Mock<UserManager<ApplicationUser>> _mockUserManager;

        [TestInitialize]
        public void Setup()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _context = new ApplicationDbContext(options);

            // Setup Configuration mock
            _mockJwtSection = new Mock<IConfigurationSection>();
            _mockJwtSection
                .Setup(x => x["SecretKey"])
                .Returns(
                    "AccArenas-Super-Secret-JWT-Key-For-Game-Account-Website-2026-Test-Key-123456789"
                );
            _mockJwtSection.Setup(x => x["ExpirationMinutes"]).Returns("30");
            _mockJwtSection.Setup(x => x["Issuer"]).Returns("AccArenas-Test");
            _mockJwtSection.Setup(x => x["Audience"]).Returns("AccArenas-Users-Test");

            _mockConfiguration = new Mock<IConfiguration>();
            _mockConfiguration
                .Setup(x => x.GetSection("JwtSettings"))
                .Returns(_mockJwtSection.Object);

            // Setup UserManager mock
            var mockUserStore = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(
                mockUserStore.Object,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
            );

            _jwtService = new JwtService(
                _mockConfiguration.Object,
                _context,
                _mockUserManager.Object
            );
        }

        [TestCleanup]
        public void Cleanup()
        {
            _context.Dispose();
        }

        #region AUTH_FUNC01 - GenerateTokensAsync

        [TestMethod]
        public async Task GenerateTokensAsync_ValidUserAndRoles_ShouldReturnTokens()
        {
            // Arrange
            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = "testuser",
                Email = "test@example.com",
                FullName = "Test User",
            };
            var roles = new List<string> { "User", "Admin" };

            // Act
            var result = await _jwtService.GenerateTokensAsync(
                user,
                roles,
                "127.0.0.1",
                "Test Browser"
            );

            // Assert
            Assert.IsNotNull(result.AccessToken);
            Assert.IsNotNull(result.RefreshToken);
            Assert.IsTrue(result.ExpiresAt > DateTime.UtcNow);

            // Verify token content
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.ReadJwtToken(result.AccessToken);

            Assert.AreEqual(
                user.Id.ToString(),
                token.Claims.First(c => c.Type == JwtRegisteredClaimNames.Sub).Value
            );
            Assert.AreEqual(
                user.Email,
                token.Claims.First(c => c.Type == JwtRegisteredClaimNames.Email).Value
            );
            Assert.AreEqual(
                user.UserName,
                token.Claims.First(c => c.Type == JwtRegisteredClaimNames.UniqueName).Value
            );
            Assert.AreEqual(
                user.FullName,
                token.Claims.First(c => c.Type == ClaimTypes.Name).Value
            );

            var roleClaims = token
                .Claims.Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToList();
            Assert.IsTrue(roleClaims.Contains("User"));
            Assert.IsTrue(roleClaims.Contains("Admin"));

            UpdateTestResult("AUTH_FUNC01", "UTCID01", "P");
        }

        [TestMethod]
        public async Task GenerateTokensAsync_UTCID04_WithIpAddress_ShouldReturnTokens()
        {
            // Arrange
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "ipuser" };
            
            // Act
            var result = await _jwtService.GenerateTokensAsync(user, new List<string>(), "192.168.1.1");

            // Assert
            Assert.IsNotNull(result.AccessToken);
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == result.RefreshToken);
            Assert.AreEqual("192.168.1.1", token?.IpAddress);
            UpdateTestResult("AUTH_FUNC01", "UTCID04", "P");
        }

        [TestMethod]
        public async Task GenerateTokensAsync_UTCID05_WithDeviceInfo_ShouldReturnTokens()
        {
            // Arrange
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "deviceuser" };
            
            // Act
            var result = await _jwtService.GenerateTokensAsync(user, new List<string>(), null, "iPhone 13");

            // Assert
            Assert.IsNotNull(result.AccessToken);
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == result.RefreshToken);
            Assert.AreEqual("iPhone 13", token?.DeviceInfo);
            UpdateTestResult("AUTH_FUNC01", "UTCID05", "P");
        }

        #endregion

        #region AUTH_FUNC02 - ValidateRefreshTokenAsync

        [TestMethod]
        public async Task ValidateRefreshTokenAsync_UTCID03_WrongUserId_ShouldReturnFalse()
        {
            // Arrange
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "user1" };
            var tokenResult = await _jwtService.GenerateTokensAsync(user, new List<string>());

            // Act
            var result = await _jwtService.ValidateRefreshTokenAsync(tokenResult.RefreshToken, Guid.NewGuid().ToString());

            // Assert
            Assert.IsFalse(result);
            UpdateTestResult("AUTH_FUNC02", "UTCID03", "P");
        }

        [TestMethod]
        public async Task ValidateRefreshTokenAsync_UTCID04_RevokedToken_ShouldReturnFalse()
        {
            // Arrange
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "user1" };
            var tokenResult = await _jwtService.GenerateTokensAsync(user, new List<string>());
            await _jwtService.RevokeRefreshTokenAsync(tokenResult.RefreshToken);

            // Act
            var result = await _jwtService.ValidateRefreshTokenAsync(tokenResult.RefreshToken, user.Id.ToString());

            // Assert
            Assert.IsFalse(result);
            UpdateTestResult("AUTH_FUNC02", "UTCID04", "P");
        }

        [TestMethod]
        public async Task ValidateRefreshTokenAsync_UTCID05_NullToken_ShouldReturnFalse()
        {
            // Act
            var result = await _jwtService.ValidateRefreshTokenAsync(null!, Guid.NewGuid().ToString());

            // Assert
            Assert.IsFalse(result);
            UpdateTestResult("AUTH_FUNC02", "UTCID05", "P");
        }

        #endregion

        #region AUTH_FUNC03 - RevokeRefreshTokenAsync

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_UTCID01_ExistingToken_ShouldRevoke()
        {
            // Arrange
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser" };
            var tokenResult = await _jwtService.GenerateTokensAsync(user, new List<string>());

            // Act
            await _jwtService.RevokeRefreshTokenAsync(tokenResult.RefreshToken);

            // Assert
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == tokenResult.RefreshToken);
            Assert.IsTrue(token?.IsRevoked);
            UpdateTestResult("AUTH_FUNC03", "UTCID01", "P");
        }

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_UTCID02_NonExistentToken_ShouldNotThrow()
        {
            // Act & Assert (Should not throw exception)
            await _jwtService.RevokeRefreshTokenAsync("non_existent");
            UpdateTestResult("AUTH_FUNC03", "UTCID02", "P");
        }

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_UTCID03_AlreadyRevoked_ShouldStayRevoked()
        {
            // Arrange
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "user1" };
            var tokenResult = await _jwtService.GenerateTokensAsync(user, new List<string>());
            await _jwtService.RevokeRefreshTokenAsync(tokenResult.RefreshToken);

            // Act
            await _jwtService.RevokeRefreshTokenAsync(tokenResult.RefreshToken);

            // Assert
            var token = await _context.RefreshTokens.FirstOrDefaultAsync(t => t.Token == tokenResult.RefreshToken);
            Assert.IsTrue(token?.IsRevoked);
            UpdateTestResult("AUTH_FUNC03", "UTCID03", "P");
        }

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_UTCID04_NullToken_ShouldNotThrow()
        {
            // Act & Assert
            await _jwtService.RevokeRefreshTokenAsync(null!);
            UpdateTestResult("AUTH_FUNC03", "UTCID04", "P");
        }

        [TestMethod]
        public async Task RevokeRefreshTokenAsync_UTCID05_EmptyToken_ShouldNotThrow()
        {
            // Act & Assert
            await _jwtService.RevokeRefreshTokenAsync("");
            UpdateTestResult("AUTH_FUNC03", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
