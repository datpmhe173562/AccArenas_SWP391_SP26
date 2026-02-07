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
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public RolesController(
            RoleManager<ApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IMapper mapper
        )
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null
        )
        {
            var query = _roleManager.Roles.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(r =>
                    (r.Name != null && r.Name.Contains(search))
                    || (r.Description != null && r.Description.Contains(search))
                );
            }

            var totalCount = await query.CountAsync();
            var roles = await query
                .OrderBy(r => r.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var rolesDto = _mapper.Map<IEnumerable<RoleDto>>(roles);

            return Ok(
                new
                {
                    Items = rolesDto,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                }
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDto>> GetRole(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());

            if (role == null)
            {
                throw new ApiException($"Role with ID {id} not found", HttpStatusCode.NotFound);
            }

            var roleDto = _mapper.Map<RoleDto>(role);

            return Ok(roleDto);
        }

        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Invalid model state", HttpStatusCode.BadRequest);
            }

            // Check if role already exists
            var existingRole = await _roleManager.FindByNameAsync(request.Name);
            if (existingRole != null)
            {
                throw new ApiException("Role with this name already exists", HttpStatusCode.BadRequest);
            }

            var role = _mapper.Map<ApplicationRole>(request);

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to create role", HttpStatusCode.BadRequest, errors);
            }

            var roleDto = _mapper.Map<RoleDto>(role);

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, roleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(Guid id, UpdateRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                throw new ApiException("Invalid model state", HttpStatusCode.BadRequest);
            }

            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                throw new ApiException($"Role with ID {id} not found", HttpStatusCode.NotFound);
            }

            _mapper.Map(request, role);

            var result = await _roleManager.UpdateAsync(role);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to update role", HttpStatusCode.BadRequest, errors);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                throw new ApiException($"Role with ID {id} not found", HttpStatusCode.NotFound);
            }

            // Check if role is being used by any users
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
            if (usersInRole.Any())
            {
                throw new ApiException(
                    $"Cannot delete role '{role.Name}' because it is assigned to {usersInRole.Count} user(s)",
                    HttpStatusCode.BadRequest
                );
            }

            // Prevent deletion of system roles
            var systemRoles = new[] { "Admin", "Customer", "Staff" };
            if (systemRoles.Contains(role.Name))
            {
                throw new ApiException("Cannot delete system roles", HttpStatusCode.BadRequest);
            }

            var result = await _roleManager.DeleteAsync(role);

            if (!result.Succeeded)
            {
                var errors = result.Errors.ToDictionary(e => e.Code, e => e.Description);
                throw new ApiException("Failed to delete role", HttpStatusCode.BadRequest, errors);
            }

            return NoContent();
        }

        [HttpGet("{id}/users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersInRole(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                throw new ApiException($"Role with ID {id} not found", HttpStatusCode.NotFound);
            }

            var users = await _userManager.GetUsersInRoleAsync(role.Name!);
            var usersDto = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersDto.Add(new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    FullName = user.FullName,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    Roles = roles
                });
            }

            return Ok(usersDto);
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();

            var rolesDto = roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
            });

            return Ok(rolesDto);
        }

        [HttpGet("system")]
        public ActionResult<IEnumerable<string>> GetSystemRoles()
        {
            var systemRoles = new[] { "Admin", "Customer", "Staff" };
            return Ok(systemRoles);
        }

        [HttpGet("{roleName}/exists")]
        public async Task<ActionResult<bool>> CheckRoleExists(string roleName)
        {
            var exists = await _roleManager.RoleExistsAsync(roleName);
            return Ok(exists);
        }
    }
}
