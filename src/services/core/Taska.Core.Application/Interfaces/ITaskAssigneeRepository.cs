using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface ITaskAssigneeRepository
{
    Task<TaskAssignee> AddAsync(TaskAssignee assignee, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<TaskAssignee>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default);
    Task<bool> RemoveAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default);
}