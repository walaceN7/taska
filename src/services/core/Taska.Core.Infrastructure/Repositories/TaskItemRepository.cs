using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class TaskItemRepository(TaskaCoreDbContext context) : ITaskItemRepository
{
    public async Task<TaskItem> AddAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        context.Tasks.Add(taskItem);
        await context.SaveChangesAsync(cancellationToken);
        return taskItem;
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Tasks.Include(t => t.Column).FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<TaskItem> UpdateAsync(TaskItem taskItem, CancellationToken cancellationToken = default)
    {
        context.Tasks.Update(taskItem);
        await context.SaveChangesAsync(cancellationToken);
        return taskItem;
    }

    public async Task<List<TaskItem>> GetByColumnIdAsync(Guid columnId, CancellationToken cancellationToken = default)
    {
        return await context.Tasks.Where(t => t.ColumnId == columnId).OrderBy(t => t.Order).AsNoTracking().ToListAsync(cancellationToken);
    }    

    public async Task<int> GetNextOrderAsync(Guid columnId, CancellationToken cancellationToken = default)
    {
        return await context.Tasks.Where(t => t.ColumnId == columnId).MaxAsync(t => (int?)t.Order, cancellationToken) + 1 ?? 0;
    }

    public async Task ShiftOrdersAsync(Guid columnId, int startOrder, int? endOrder, int shiftAmount, CancellationToken cancellationToken = default)
    {
        var query = context.Tasks.Where(t => t.ColumnId == columnId && t.Order >= startOrder);

        if (endOrder.HasValue)
        {
            query = query.Where(t => t.Order <= endOrder.Value);
        }

        await query.ExecuteUpdateAsync(s => s.SetProperty(t => t.Order, t => t.Order + shiftAmount), cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var taskItem = await context.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (taskItem == null)
        {
            return false;
        }

        taskItem.IsActive = !taskItem.IsActive;
        context.Update(taskItem);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
