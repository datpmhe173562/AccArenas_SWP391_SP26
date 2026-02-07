using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Exceptions;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly ILogger<UsersController> _logger;

        public UsersController(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IMapper mapper,
            ILogger<UsersController> logger
        )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] bool? isActive = null
        )
        {
            var query = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    (u.UserName != null && u.UserName.Contains(search))
                    || (u.Email != null && u.Email.Contains(search))
                    || (u.FullName != null && u.FullName.Contains(search))
                );
            }

            if (isActive.HasValue)
            {
                query = query.Where(u => u.IsActive == isActive.Value);
            }

            var totalCount = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.UserName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var usersDto = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersDto.Add(
                    new UserDto
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        FullName = user.FullName,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        Roles = roles,
                    }
                );
            }

            return Ok(
                new
                {
                    Items = usersDto,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                }
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Roles = roles
            };

            return Ok(userDto);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserRequest request)
        {
            _logger.LogInformation("[CreateUser] Starting user creation for username: {UserName}", request.UserName);
            
            if (!ModelState.IsValid)
            {
                throw new ApiException("Invalid model state", HttpStatusCode.BadRequest);
            }

            // Check if username already exists
            var existingUser = await _userManager.FindByNameAsync(request.UserName);
            if (existingUser != null)
            {
                throw new ApiException("Username already exists", HttpStatusCode.BadRequest);
            }

            // Check if email already exists
            var existingEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingEmail != null)
            {
                throw new ApiException("Email already exists", HttpStatusCode.BadRequest);
            }

            var user = _mapper.Map<ApplicationUser>(request);
            _logger.LogInformation("[CreateUser] Creating user with password");

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to create user", HttpStatusCode.BadRequest, errors);
            }

            _logger.LogInformation("[CreateUser] User created successfully with ID: {UserId}", user.Id);

            // Assign roles if provided
            if (request.Roles.Any())
            {
                var validRoles = new List<string>();
                foreach (var roleName in request.Roles)
                {
                    var roleExists = await _roleManager.RoleExistsAsync(roleName);
                    if (roleExists)
                    {
                        validRoles.Add(roleName);
                    }
                    else
                    {
                        _logger.LogWarning("[CreateUser] Role {RoleName} does not exist", roleName);
                    }
                }

                if (validRoles.Any())
                {
                    await _userManager.AddToRolesAsync(user, validRoles);
                    _logger.LogInformation("[CreateUser] Assigned roles: {Roles}", string.Join(", ", validRoles));
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                FullName = user.FullName,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Roles = roles
            };

            _logger.LogInformation("[CreateUser] User creation completed for {UserName}", user.UserName);
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserRequest request)
        {
            _logger.LogInformation("[UpdateUser] Starting user update for ID: {UserId}", id);
            
            if (!ModelState.IsValid)
            {
                throw new ApiException("Invalid model state", HttpStatusCode.BadRequest);
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            _logger.LogInformation("[UpdateUser] Updating user {UserName}", user.UserName);
            _mapper.Map(request, user);

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to update user", HttpStatusCode.BadRequest, errors);
            }

            // Update password if provided
            if (!string.IsNullOrEmpty(request.Password))
            {
                _logger.LogInformation("[UpdateUser] Updating password for user {UserName}", user.UserName);
                
                // Remove old password and set new one
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, token, request.Password);
                
                if (!passwordResult.Succeeded)
                {
                    var errors = passwordResult.Errors.ToDictionary(e => e.Code, e => e.Description);
                    throw new ApiException("Failed to update password", HttpStatusCode.BadRequest, errors);
                }
                
                _logger.LogInformation("[UpdateUser] Password updated successfully");
            }

            _logger.LogInformation("[UpdateUser] User update completed for {UserName}", user.UserName);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to delete user", HttpStatusCode.BadRequest, errors);
            }

            return NoContent();
        }

        [HttpPost("{id}/roles")]
        public async Task<IActionResult> AssignRole(Guid id, AssignRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            var roleExists = await _roleManager.RoleExistsAsync(request.RoleName);
            if (!roleExists)
            {
                throw new ApiException("Role does not exist", HttpStatusCode.BadRequest);
            }

            var isInRole = await _userManager.IsInRoleAsync(user, request.RoleName);
            if (isInRole)
            {
                throw new ApiException("User already has this role", HttpStatusCode.BadRequest);
            }

            var result = await _userManager.AddToRoleAsync(user, request.RoleName);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to assign role", HttpStatusCode.BadRequest, errors);
            }

            return Ok($"Role '{request.RoleName}' assigned to user successfully");
        }

        [HttpDelete("{id}/roles")]
        public async Task<IActionResult> RemoveRole(Guid id, RemoveRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            var isInRole = await _userManager.IsInRoleAsync(user, request.RoleName);
            if (!isInRole)
            {
                throw new ApiException("User does not have this role", HttpStatusCode.BadRequest);
            }

            var result = await _userManager.RemoveFromRoleAsync(user, request.RoleName);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to remove role", HttpStatusCode.BadRequest, errors);
            }

            return Ok($"Role '{request.RoleName}' removed from user successfully");
        }

        [HttpGet("{id}/roles")]
        public async Task<ActionResult<IEnumerable<string>>> GetUserRoles(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles);
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleUserStatus(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                throw new ApiException($"User with ID {id} not found", HttpStatusCode.NotFound);
            }

            user.IsActive = !user.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to toggle user status", HttpStatusCode.BadRequest, errors);
            }

            return Ok(new { IsActive = user.IsActive });
        }
    }
}
