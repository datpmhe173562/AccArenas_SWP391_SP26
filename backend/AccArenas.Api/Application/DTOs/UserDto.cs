using System;

namespace AccArenas.Api.Application.DTOs
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
    }

    public class CreateUserRequest
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public bool IsActive { get; set; } = true;
        public IList<string> Roles { get; set; } = new List<string>();
    }

    public class UpdateUserRequest
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public bool IsActive { get; set; }
    }

    public class AssignRoleRequest
    {
        public Guid UserId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }

    public class RemoveRoleRequest
    {
        public Guid UserId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
