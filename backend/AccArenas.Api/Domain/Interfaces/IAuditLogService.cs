using System;
using System.Threading.Tasks;
using AccArenas.Api.Application.DTOs;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IAuditLogService
    {
        Task<AuditLogResponse> GetAuditLogsAsync(
            int page = 1, 
            int pageSize = 20,
            string? searchTerm = null,
            string? actionFilter = null,
            string? entityTypeFilter = null,
            string? roleFilter = null
        );
        Task LogActionAsync(Guid userId, string action, string entityType, string entityId, string details);
    }
}
