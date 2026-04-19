using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface IChecklistItemRepository
{
    Task<ChecklistItem> AddAsync(ChecklistItem checklistItem, CancellationToken cancellationToken = default);
    Task<ChecklistItem?> GetByIdAsync(Guid checklistId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ChecklistItem>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default);
    Task<ChecklistItem> UpdateAsync(ChecklistItem checklistItem, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid checklistId, CancellationToken cancellationToken = default);
    Task<bool> ChangeStatusAsync(Guid checklistId, CancellationToken cancellationToken = default);
    Task<int> GetNextOrderAsync(Guid taskId, CancellationToken cancellationToken = default);
}
