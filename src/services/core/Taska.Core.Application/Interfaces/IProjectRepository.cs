using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface IProjectRepository
{
    Task<Project> AddAsync(Project project, CancellationToken cancellationToken);
    Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ICollection<Project>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken);
    Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken);
    Task AddMemberAsync(ProjectMember member, CancellationToken cancellationToken);
    Task<bool> IsMemberAsync(Guid projectId, Guid userId, CancellationToken cancellationToken);
}
