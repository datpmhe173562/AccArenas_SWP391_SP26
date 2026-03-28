using System;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using AccArenas.Api.Application.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AccArenas.Api.Application.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly ApplicationDbContext _context;

        public AuditLogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AuditLogResponse> GetAuditLogsAsync(
            int page = 1, 
            int pageSize = 20,
            string? searchTerm = null,
            string? actionFilter = null,
            string? entityTypeFilter = null,
            string? roleFilter = null
        )
        {
            var query = _context.AuditLogs
                .Include(a => a.User)
                .AsQueryable();

            if (!string.IsNullOrEmpty(actionFilter))
            {
                query = query.Where(a => a.Action == actionFilter);
            }

            if (!string.IsNullOrEmpty(entityTypeFilter))
            {
                query = query.Where(a => a.EntityType == entityTypeFilter);
            }

            if (!string.IsNullOrEmpty(roleFilter))
            {
                var roleId = await _context.Roles
                    .Where(r => r.Name == roleFilter)
                    .Select(r => r.Id)
                    .FirstOrDefaultAsync();

                if (roleId != Guid.Empty)
                {
                    var userIdsInRole = await _context.UserRoles
                        .Where(ur => ur.RoleId == roleId)
                        .Select(ur => ur.UserId)
                        .ToListAsync();

                    query = query.Where(a => userIdsInRole.Contains(a.UserId));
                }
                else
                {
                    // If role doesn't exist, return empty res
                    query = query.Where(a => false);
                }
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(a => 
                    (a.User != null && a.User.UserName != null && a.User.UserName.Contains(searchTerm)) ||
                    a.Details.Contains(searchTerm) ||
                    a.EntityId.Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var logs = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new AuditLogDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    UserName = a.User != null ? a.User.UserName : null,
                    Action = a.Action,
                    EntityType = a.EntityType,
                    EntityId = a.EntityId,
                    Details = a.Details,
                    CreatedAt = a.CreatedAt
                })
                .ToListAsync();

            return new AuditLogResponse
            {
                Logs = logs,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task LogActionAsync(Guid userId, string action, string entityType, string entityId, string details)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details,
                CreatedAt = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}
