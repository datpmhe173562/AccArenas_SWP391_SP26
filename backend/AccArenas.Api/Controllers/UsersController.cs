using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
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
                return NotFound($"User with ID {id} not found");
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
                _logger.LogWarning("[CreateUser] Invalid model state");
                return BadRequest(ModelState);
            }

            // Check if username already exists
            var existingUser = await _userManager.FindByNameAsync(request.UserName);
            if (existingUser != null)
            {
                _logger.LogWarning("[CreateUser] Username {UserName} already exists", request.UserName);
                return BadRequest("Username already exists");
            }

            // Check if email already exists
            var existingEmail = await _userManager.FindByEmailAsync(request.Email);
            if (existingEmail != null)
            {
                _logger.LogWarning("[CreateUser] Email {Email} already exists", request.Email);
                return BadRequest("Email already exists");
            }

            var user = _mapper.Map<ApplicationUser>(request);
            _logger.LogInformation("[CreateUser] Creating user with password");

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                _logger.LogError("[CreateUser] Failed to create user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                return BadRequest(result.Errors);
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
                _logger.LogWarning("[UpdateUser] Invalid model state");
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                _logger.LogWarning("[UpdateUser] User with ID {UserId} not found", id);
                return NotFound($"User with ID {id} not found");
            }

            _logger.LogInformation("[UpdateUser] Updating user {UserName}", user.UserName);
            _mapper.Map(request, user);

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                _logger.LogError("[UpdateUser] Failed to update user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                return BadRequest(result.Errors);
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
                    _logger.LogError("[UpdateUser] Failed to update password: {Errors}", string.Join(", ", passwordResult.Errors.Select(e => e.Description)));
                    return BadRequest(passwordResult.Errors);
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
                return NotFound($"User with ID {id} not found");
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        [HttpPost("{id}/roles")]
        public async Task<IActionResult> AssignRole(Guid id, AssignRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound($"User with ID {id} not found");
            }

            var roleExists = await _roleManager.RoleExistsAsync(request.RoleName);
            if (!roleExists)
            {
                return BadRequest("Role does not exist");
            }

            var isInRole = await _userManager.IsInRoleAsync(user, request.RoleName);
            if (isInRole)
            {
                return BadRequest("User already has this role");
            }

            var result = await _userManager.AddToRoleAsync(user, request.RoleName);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok($"Role '{request.RoleName}' assigned to user successfully");
        }

        [HttpDelete("{id}/roles")]
        public async Task<IActionResult> RemoveRole(Guid id, RemoveRoleRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound($"User with ID {id} not found");
            }

            var isInRole = await _userManager.IsInRoleAsync(user, request.RoleName);
            if (!isInRole)
            {
                return BadRequest("User does not have this role");
            }

            var result = await _userManager.RemoveFromRoleAsync(user, request.RoleName);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok($"Role '{request.RoleName}' removed from user successfully");
        }

        [HttpGet("{id}/roles")]
        public async Task<ActionResult<IEnumerable<string>>> GetUserRoles(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound($"User with ID {id} not found");
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
                return NotFound($"User with ID {id} not found");
            }

            user.IsActive = !user.IsActive;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { IsActive = user.IsActive });
        }
    }
}
