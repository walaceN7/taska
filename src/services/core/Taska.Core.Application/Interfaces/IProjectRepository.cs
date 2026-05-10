using Taska.Core.Domain.Entities;
using Taska.Core.Domain.Enums;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Interfaces;

public interface IProjectRepository
{
    Task<Project> AddAsync(Project project, CancellationToken cancellationToken);
    Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ICollection<Project>> GetByCompanyAsync(Guid userId, string systemRole, Guid companyId, CancellationToken cancellationToken);
    Task<PagedResult<Project>> GetByCompanyAsync(Guid userId, string systemRole, Guid companyId, PaginationParams paginationParams, CancellationToken cancellationToken);
    Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task AddMemberAsync(ProjectMember member, CancellationToken cancellationToken);
    Task RemoveMemberAsync(Project project, Guid userId, CancellationToken cancellationToken);
    Task UpdateMemberAsync(Guid projectId, Guid userId, ProjectRole newRole, CancellationToken cancellationToken);
    Task<bool> IsMemberAsync(Guid projectId, Guid userId, CancellationToken cancellationToken);
}
