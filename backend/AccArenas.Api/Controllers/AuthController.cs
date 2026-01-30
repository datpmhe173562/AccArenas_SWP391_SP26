using System.Security.Claims;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Exceptions;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;

        public AuthController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IUnitOfWork unitOfWork,
            IJwtService jwtService
        )
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
        }

        /// <summary>
        /// Đăng nhập vào hệ thống
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToDictionary(error => Guid.NewGuid().ToString(), error => error);
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_INPUT, errors);
            }

            // Tìm user theo username hoặc email
            var user =
                await _userManager.FindByNameAsync(request.UsernameOrEmail)
                ?? await _userManager.FindByEmailAsync(request.UsernameOrEmail);

            if (user == null)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_CREDENTIALS);
            }

            // Kiểm tra tài khoản có bị khóa không
            if (!user.IsActive)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.USER_INACTIVE);
            }

            // Kiểm tra mật khẩu
            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                request.Password,
                false
            );
            if (!result.Succeeded)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_CREDENTIALS);
            }

            // Tạo JWT tokens
            var roles = await _userManager.GetRolesAsync(user);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

            var (accessToken, refreshToken, expiresAt) = await _jwtService.GenerateTokensAsync(
                user,
                roles,
                ipAddress,
                userAgent
            );

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.LOGIN_SUCCESS,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = expiresAt,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        Roles = roles.ToList(),
                    },
                }
            );
        }

        /// <summary>
        /// Đăng ký tài khoản mới
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToDictionary(error => Guid.NewGuid().ToString(), error => error);
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_INPUT, errors);
            }

            // Kiểm tra username đã tồn tại
            var existingUserByName = await _userManager.FindByNameAsync(request.UserName);
            if (existingUserByName != null)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.USERNAME_ALREADY_EXISTS);
            }

            // Kiểm tra email đã tồn tại
            var existingUserByEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingUserByEmail != null)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.EMAIL_ALREADY_EXISTS);
            }

            // Tạo user mới
            var user = new ApplicationUser
            {
                UserName = request.UserName,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                EmailConfirmed = false,
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw ExceptionMessages.BadRequest(ExceptionMessages.REGISTRATION_FAILED, errors);
            }

            // Thêm role mặc định cho customer
            await _userManager.AddToRoleAsync(user, "Customer");

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.REGISTRATION_SUCCESS,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        Roles = new List<string> { "Customer" },
                    },
                }
            );
        }

        /// <summary>
        /// Đăng xuất khỏi hệ thống
        /// </summary>
        [HttpPost("logout")]
        public async Task<ActionResult<AuthResponse>> Logout()
        {
            // Nếu user đã đăng nhập, sign out
            if (User.Identity?.IsAuthenticated == true)
            {
                await _signInManager.SignOutAsync();
            }

            return Ok(
                new AuthResponse { Success = true, Message = ExceptionMessages.LOGOUT_SUCCESS }
            );
        }

        /// <summary>
        /// Lấy thông tin profile người dùng hiện tại
        /// </summary>
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<AuthResponse>> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw ExceptionMessages.Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);

            // Lấy thống kê đơn hàng của user
            var orders = await _unitOfWork.Orders.GetOrdersByUserAsync(user.Id);
            var totalOrders = orders.Count();
            var totalSpent = orders.Where(o => o.Status == "Completed").Sum(o => o.TotalAmount);

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        Roles = roles.ToList(),
                    },
                }
            );
        }

        /// <summary>
        /// Đổi mật khẩu
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<ActionResult<AuthResponse>> ChangePassword(ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToDictionary(error => Guid.NewGuid().ToString(), error => error);
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_INPUT, errors);
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                throw ExceptionMessages.Unauthorized();
            }

            var result = await _userManager.ChangePasswordAsync(
                user,
                request.CurrentPassword,
                request.NewPassword
            );

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw ExceptionMessages.BadRequest(
                    ExceptionMessages.PASSWORD_CHANGE_FAILED,
                    errors
                );
            }

            // Đăng xuất tất cả session để bắt buộc đăng nhập lại
            await _signInManager.SignOutAsync();

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.PASSWORD_CHANGED_SUCCESS,
                }
            );
        }

        /// <summary>
        /// Quên mật khẩu - Gửi email reset
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<ActionResult<AuthResponse>> ForgotPassword(ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToDictionary(error => Guid.NewGuid().ToString(), error => error);
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_EMAIL_FORMAT, errors);
            }

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                // Không tiết lộ thông tin email có tồn tại hay không (bảo mật)
                return Ok(
                    new AuthResponse
                    {
                        Success = true,
                        Message = ExceptionMessages.PASSWORD_RESET_EMAIL_SENT,
                    }
                );
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // TODO: Tích hợp service gửi email
            // await _emailService.SendPasswordResetEmailAsync(user.Email, resetToken);

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.PASSWORD_RESET_EMAIL_SENT,
                }
            );
        }

        /// <summary>
        /// Reset mật khẩu với token từ email
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<ActionResult<AuthResponse>> ResetPassword(ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToDictionary(error => Guid.NewGuid().ToString(), error => error);
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_INPUT, errors);
            }

            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.EMAIL_NOT_FOUND);
            }

            var result = await _userManager.ResetPasswordAsync(
                user,
                request.Token,
                request.NewPassword
            );

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw ExceptionMessages.BadRequest(
                    ExceptionMessages.PASSWORD_RESET_TOKEN_INVALID,
                    errors
                );
            }

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.PASSWORD_RESET_SUCCESS,
                }
            );
        }

        /// <summary>
        /// Refresh access token bằng refresh token
        /// </summary>
        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(RefreshTokenRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Values.SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToDictionary(error => Guid.NewGuid().ToString(), error => error);
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_INPUT, errors);
            }

            // Validate expired access token
            var user = await _jwtService.GetUserFromExpiredTokenAsync(request.AccessToken);
            if (user == null)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_TOKEN);
            }

            // Validate refresh token
            var isValidRefreshToken = await _jwtService.ValidateRefreshTokenAsync(
                request.RefreshToken,
                user.Id.ToString()
            );
            if (!isValidRefreshToken)
            {
                throw ExceptionMessages.BadRequest(ExceptionMessages.INVALID_REFRESH_TOKEN);
            }

            // Generate new tokens
            var roles = await _userManager.GetRolesAsync(user);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

            // Revoke old refresh token
            await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);

            // Generate new tokens
            var (newAccessToken, newRefreshToken, expiresAt) =
                await _jwtService.GenerateTokensAsync(user, roles, ipAddress, userAgent);

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.TOKEN_REFRESHED_SUCCESS,
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresAt = expiresAt,
                    User = new UserInfo
                    {
                        Id = user.Id,
                        UserName = user.UserName ?? string.Empty,
                        Email = user.Email ?? string.Empty,
                        FullName = user.FullName,
                        PhoneNumber = user.PhoneNumber,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        Roles = roles.ToList(),
                    },
                }
            );
        }

        /// <summary>
        /// Revoke refresh token (logout từ device cụ thể)
        /// </summary>
        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<ActionResult<AuthResponse>> RevokeToken(RevokeTokenRequest request)
        {
            await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);

            return Ok(
                new AuthResponse
                {
                    Success = true,
                    Message = ExceptionMessages.TOKEN_REVOKED_SUCCESS,
                }
            );
        }

        /// <summary>
        /// OAuth2 Token Endpoint cho OpenIddict (dùng cho API authentication)
        /// </summary>
        [HttpPost("/connect/token")]
        public async Task<IActionResult> Exchange()
        {
            var form = await Request.ReadFormAsync();
            var grantType = form["grant_type"].ToString();

            if (string.IsNullOrEmpty(grantType) || grantType != GrantTypes.Password)
            {
                return BadRequest(
                    new
                    {
                        error = "invalid_grant",
                        error_description = "Chỉ hỗ trợ password grant type",
                    }
                );
            }

            var username = form["username"].ToString();
            var password = form["password"].ToString();

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return BadRequest(
                    new
                    {
                        error = "invalid_request",
                        error_description = "Username và password là bắt buộc",
                    }
                );
            }

            var user =
                await _userManager.FindByNameAsync(username)
                ?? await _userManager.FindByEmailAsync(username);

            if (user == null || !user.IsActive)
            {
                return Forbid();
            }

            if (!await _userManager.CheckPasswordAsync(user, password))
            {
                return Forbid();
            }

            // Tạo claims cho JWT token
            var identity = new ClaimsIdentity("Password");
            identity.AddClaim(new Claim(Claims.Subject, user.Id.ToString()));
            identity.AddClaim(new Claim(Claims.Username, user.UserName ?? string.Empty));
            identity.AddClaim(new Claim(Claims.Email, user.Email ?? string.Empty));

            if (!string.IsNullOrEmpty(user.FullName))
            {
                identity.AddClaim(new Claim(Claims.Name, user.FullName));
            }

            // Thêm roles vào claims
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                identity.AddClaim(new Claim(Claims.Role, role));
            }

            var principal = new ClaimsPrincipal(identity);

            return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
        }
    }
}
