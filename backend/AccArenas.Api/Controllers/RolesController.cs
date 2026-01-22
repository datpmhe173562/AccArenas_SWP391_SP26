using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMappingService _mappingService;

        public RolesController(
            RoleManager<ApplicationRole> roleManager,
            UserManager<ApplicationUser> userManager,
            IMappingService mappingService
        )
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _mappingService = mappingService;
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

            var rolesDto = _mappingService.ToDto(roles);

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
                return NotFound($"Role with ID {id} not found");
            }

            var roleDto = _mappingService.ToDto(role);

            return Ok(roleDto);
        }

        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if role already exists
            var existingRole = await _roleManager.FindByNameAsync(request.Name);
            if (existingRole != null)
            {
                return BadRequest("Role with this name already exists");
            }

            var role = _mappingService.ToEntity(request);

            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleDto = _mappingService.ToDto(role);

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, roleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(Guid id, UpdateRoleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                return NotFound($"Role with ID {id} not found");
            }

            _mappingService.UpdateEntity(role, request);

            var result = await _roleManager.UpdateAsync(role);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                return NotFound($"Role with ID {id} not found");
            }

            // Check if role is being used by any users
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
            if (usersInRole.Any())
            {
                return BadRequest(
                    $"Cannot delete role '{role.Name}' because it is assigned to {usersInRole.Count} user(s)"
                );
            }

            // Prevent deletion of system roles
            var systemRoles = new[] { "Admin", "Customer", "Staff" };
            if (systemRoles.Contains(role.Name))
            {
                return BadRequest("Cannot delete system roles");
            }

            var result = await _roleManager.DeleteAsync(role);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }

        [HttpGet("{id}/users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersInRole(Guid id)
        {
            var role = await _roleManager.FindByIdAsync(id.ToString());
            if (role == null)
            {
                return NotFound($"Role with ID {id} not found");
            }

            var users = await _userManager.GetUsersInRoleAsync(role.Name!);
            var usersDto = await _mappingService.ToDto(users, _userManager);

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
