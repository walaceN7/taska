using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface ITaskItemRepository
{
    Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
    Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskItem> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default);
    Task<List<TaskItem>> GetByColumnIdAsync(Guid columnId, CancellationToken cancellationToken = default);
    Task<int> GetNextOrderAsync(Guid columnId, CancellationToken cancellationToken = default);
}
