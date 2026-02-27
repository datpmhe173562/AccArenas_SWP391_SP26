using System.Security.Claims;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Controllers;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using AccArenas.Api.Application.Exceptions;

namespace AccArenas.Tests.Controllers
{
    [TestClass]
    public class AuthControllerTests
    {
        private Mock<UserManager<ApplicationUser>> _mockUserManager = default!;
        private Mock<SignInManager<ApplicationUser>> _mockSignInManager = default!;
        private Mock<RoleManager<ApplicationRole>> _mockRoleManager = default!;
        private Mock<IUnitOfWork> _mockUnitOfWork = default!;
        private Mock<IJwtService> _mockJwtService = default!;
        private Mock<IEmailService> _mockEmailService = default!;
        private AuthController _controller = default!;

        [TestInitialize]
        public void Setup()
        {
            var userStore = new Mock<IUserStore<ApplicationUser>>();
            _mockUserManager = new Mock<UserManager<ApplicationUser>>(userStore.Object, null!, null!, null!, null!, null!, null!, null!, null!);
            
            var contextAccessor = new Mock<IHttpContextAccessor>();
            var userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
            _mockSignInManager = new Mock<SignInManager<ApplicationUser>>(_mockUserManager.Object, contextAccessor.Object, userPrincipalFactory.Object, null!, null!, null!, null!);
            
            var roleStore = new Mock<IRoleStore<ApplicationRole>>();
            _mockRoleManager = new Mock<RoleManager<ApplicationRole>>(roleStore.Object, null!, null!, null!, null!);
            
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockJwtService = new Mock<IJwtService>();
            _mockEmailService = new Mock<IEmailService>();

            _controller = new AuthController(
                _mockSignInManager.Object,
                _mockUserManager.Object,
                _mockRoleManager.Object,
                _mockUnitOfWork.Object,
                _mockJwtService.Object,
                _mockEmailService.Object
            );

            var httpContext = new DefaultHttpContext();
            _controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
        }

        #region AUTH_FUNC04 - Login

        [TestMethod]
        public async Task Login_UTCID01_ValidCredentials_ShouldReturnOk()
        {
            // Arrange
            var request = new LoginRequest { UsernameOrEmail = "testuser", Password = "Password123!" };
            var user = new ApplicationUser { Id = Guid.NewGuid(), UserName = "testuser", IsActive = true };
            
            _mockUserManager.Setup(m => m.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            _mockSignInManager.Setup(m => m.CheckPasswordSignInAsync(user, request.Password, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);
            _mockUserManager.Setup(m => m.GetRolesAsync(user)).ReturnsAsync(new List<string> { "Customer" });
            _mockJwtService.Setup(m => m.GenerateTokensAsync(user, It.IsAny<IList<string>>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(("access", "refresh", DateTime.UtcNow.AddHours(1)));

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            UpdateTestResult("AUTH_FUNC04", "UTCID01", "P");
        }

        [TestMethod]
        public async Task Login_UTCID02_UserNotFound_ShouldThrowException()
        {
            // Arrange
            var request = new LoginRequest { UsernameOrEmail = "wronguser", Password = "password" };
            _mockUserManager.Setup(m => m.FindByNameAsync(It.IsAny<string>())).ReturnsAsync((ApplicationUser)null!);
            _mockUserManager.Setup(m => m.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync((ApplicationUser)null!);

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Login(request));
            UpdateTestResult("AUTH_FUNC04", "UTCID02", "P");
        }

        [TestMethod]
        public async Task Login_UTCID03_UserInactive_ShouldThrowException()
        {
            // Arrange
            var request = new LoginRequest { UsernameOrEmail = "inactive", Password = "password" };
            var user = new ApplicationUser { IsActive = false };
            _mockUserManager.Setup(m => m.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Login(request));
            UpdateTestResult("AUTH_FUNC04", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Login_UTCID04_InvalidPassword_ShouldThrowException()
        {
            // Arrange
            var request = new LoginRequest { UsernameOrEmail = "testuser", Password = "wrongpassword" };
            var user = new ApplicationUser { IsActive = true };
            _mockUserManager.Setup(m => m.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            _mockSignInManager.Setup(m => m.CheckPasswordSignInAsync(user, request.Password, false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Login(request));
            UpdateTestResult("AUTH_FUNC04", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Login_UTCID05_InvalidModelState_ShouldThrowException()
        {
            // Arrange
            _controller.ModelState.AddModelError("Error", "Message");
            var request = new LoginRequest();

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Login(request));
            UpdateTestResult("AUTH_FUNC04", "UTCID05", "P");
        }

        #endregion

        #region AUTH_FUNC05 - Register

        [TestMethod]
        public async Task Register_UTCID01_ValidData_ShouldReturnOk()
        {
            // Arrange
            var request = new RegisterRequest { UserName = "newuser", Email = "new@test.com", Password = "Password123!", FullName = "New User" };
            _mockUserManager.Setup(m => m.FindByNameAsync(request.UserName)).ReturnsAsync((ApplicationUser)null!);
            _mockUserManager.Setup(m => m.FindByEmailAsync(request.Email)).ReturnsAsync((ApplicationUser)null!);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), request.Password)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.Register(request);

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            UpdateTestResult("AUTH_FUNC05", "UTCID01", "P");
        }

        [TestMethod]
        public async Task Register_UTCID02_ExistingUsername_ShouldThrowException()
        {
            // Arrange
            var request = new RegisterRequest { UserName = "exists", Email = "new@test.com" };
            _mockUserManager.Setup(m => m.FindByNameAsync(request.UserName)).ReturnsAsync(new ApplicationUser());

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Register(request));
            UpdateTestResult("AUTH_FUNC05", "UTCID02", "P");
        }

        [TestMethod]
        public async Task Register_UTCID03_ExistingEmail_ShouldThrowException()
        {
            // Arrange
            var request = new RegisterRequest { UserName = "newuser", Email = "exists@test.com" };
            _mockUserManager.Setup(m => m.FindByNameAsync(request.UserName)).ReturnsAsync((ApplicationUser)null!);
            _mockUserManager.Setup(m => m.FindByEmailAsync(request.Email)).ReturnsAsync(new ApplicationUser());

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Register(request));
            UpdateTestResult("AUTH_FUNC05", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Register_UTCID04_CreationFailed_ShouldThrowException()
        {
            // Arrange
            var request = new RegisterRequest { UserName = "newuser", Email = "new@test.com", Password = "password" };
            _mockUserManager.Setup(m => m.FindByNameAsync(request.UserName)).ReturnsAsync((ApplicationUser)null!);
            _mockUserManager.Setup(m => m.FindByEmailAsync(request.Email)).ReturnsAsync((ApplicationUser)null!);
            _mockUserManager.Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), request.Password))
                .ReturnsAsync(IdentityResult.Failed(new IdentityError { Code = "Error", Description = "Error" }));

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Register(request));
            UpdateTestResult("AUTH_FUNC05", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Register_UTCID05_InvalidModelState_ShouldThrowException()
        {
            // Arrange
            _controller.ModelState.AddModelError("Error", "Message");
            var request = new RegisterRequest();

            // Act & Assert
            await Assert.ThrowsExceptionAsync<ApiException>(() => _controller.Register(request));
            UpdateTestResult("AUTH_FUNC05", "UTCID05", "P");
        }

        #endregion

        #region AUTH_FUNC06 - Logout

        [TestMethod]
        public async Task Logout_UTCID01_AuthenticatedUser_ShouldSignOutAndReturnOk()
        {
            // Arrange
            var identity = new ClaimsIdentity("Test");
            var principal = new ClaimsPrincipal(identity);
            _controller.ControllerContext.HttpContext.User = principal;

            // Act
            var result = await _controller.Logout();

            // Assert
            _mockSignInManager.Verify(m => m.SignOutAsync(), Times.Once);
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            UpdateTestResult("AUTH_FUNC06", "UTCID01", "P");
        }

        [TestMethod]
        public async Task Logout_UTCID02_UnauthenticatedUser_ShouldStillReturnOk()
        {
            // Arrange
            _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

            // Act
            var result = await _controller.Logout();

            // Assert
            _mockSignInManager.Verify(m => m.SignOutAsync(), Times.Never);
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            UpdateTestResult("AUTH_FUNC06", "UTCID02", "P");
        }

        [TestMethod]
        public async Task Logout_UTCID03_VerifySuccessStatus_ShouldReturnTrue()
        {
            // Act
            var result = await _controller.Logout() as ActionResult<AuthResponse>;
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as AuthResponse;

            // Assert
            Assert.IsTrue(response?.Success ?? false);
            UpdateTestResult("AUTH_FUNC06", "UTCID03", "P");
        }

        [TestMethod]
        public async Task Logout_UTCID04_VerifyMessage_ShouldReturnLogoutSuccess()
        {
            // Act
            var result = await _controller.Logout() as ActionResult<AuthResponse>;
            var okResult = result.Result as OkObjectResult;
            var response = okResult?.Value as AuthResponse;

            // Assert
            Assert.IsNotNull(response?.Message);
            UpdateTestResult("AUTH_FUNC06", "UTCID04", "P");
        }

        [TestMethod]
        public async Task Logout_UTCID05_MultipleConcurrentLogouts_ShouldReturnOk()
        {
            // Act
            await _controller.Logout();
            var result = await _controller.Logout();

            // Assert
            Assert.IsInstanceOfType(result.Result, typeof(OkObjectResult));
            UpdateTestResult("AUTH_FUNC06", "UTCID05", "P");
        }

        #endregion

        private void UpdateTestResult(string functionCode, string testCaseId, string result)
        {
            Console.WriteLine($"Test {functionCode}-{testCaseId}: {result}");
        }
    }
}
