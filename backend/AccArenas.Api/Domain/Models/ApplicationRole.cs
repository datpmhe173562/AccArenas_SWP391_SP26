using System;
using Microsoft.AspNetCore.Identity;

namespace AccArenas.Api.Domain.Models
{
    public class ApplicationRole : IdentityRole<Guid>
    {
        public string? Description { get; set; }
    }
}
