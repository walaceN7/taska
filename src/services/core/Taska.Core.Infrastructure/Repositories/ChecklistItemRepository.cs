using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class ChecklistItemRepository(TaskaCoreDbContext context) : IChecklistItemRepository
{
    public async Task<ChecklistItem> AddAsync(ChecklistItem checklistItem, CancellationToken cancellationToken = default)
    {
        context.ChecklistItems.Add(checklistItem);
        await context.SaveChangesAsync(cancellationToken);
        return checklistItem;
    }

    public async Task<ChecklistItem?> GetByIdAsync(Guid checklistId, CancellationToken cancellationToken = default)
    {
        return await context.ChecklistItems.FirstOrDefaultAsync(c => c.Id == checklistId, cancellationToken);
    }

    public async Task<IEnumerable<ChecklistItem>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default)
    {
        return await context.ChecklistItems.Where(c => c.TaskId == taskId).OrderBy(c => c.Order).ToListAsync(cancellationToken);
    }

    public async Task<ChecklistItem> UpdateAsync(ChecklistItem checklistItem, CancellationToken cancellationToken = default)
    {
        context.ChecklistItems.Update(checklistItem);
        await context.SaveChangesAsync(cancellationToken);
        return checklistItem;
    }

    public async Task<bool> DeleteAsync(Guid checklistId, CancellationToken cancellationToken = default)
    {
        var item = await context.ChecklistItems.FirstOrDefaultAsync(c => c.Id == checklistId, cancellationToken);
        if (item == null) return false;

        context.ChecklistItems.Remove(item);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> ChangeStatusAsync(Guid checklistId, CancellationToken cancellationToken = default)
    {
        var item = await context.ChecklistItems.FirstOrDefaultAsync(c => c.Id == checklistId, cancellationToken);

        if (item == null) return false;

        item.IsCompleted = !item.IsCompleted;
        context.ChecklistItems.Update(item);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<int> GetNextOrderAsync(Guid taskId, CancellationToken cancellationToken = default)
    {
        return await context.ChecklistItems.Where(c => c.TaskId == taskId).MaxAsync(c => (int?)c.Order, cancellationToken) + 1 ?? 0;
    }
}
